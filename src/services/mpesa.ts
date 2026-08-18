import axios from 'axios';

// Format timestamp to YYYYMMDDHHmmss
const getTimestamp = () => {
  const date = new Date();
  return date.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
};

export const getMpesaToken = async (): Promise<string> => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating M-Pesa token:', error);
    throw new Error('Failed to authenticate with M-Pesa');
  }
};

export const initiateStkPush = async (phoneNumber: string, amount: number, orderId: string) => {
  const token = await getMpesaToken();
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = getTimestamp();
  
  // Safaricom requires a base64 encoded string of shortcode + passkey + timestamp
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  // Format phone number to 254XXXXXXXXX
  const formattedPhone = phoneNumber.startsWith('0') 
    ? `254${phoneNumber.substring(1)}` 
    : phoneNumber;

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: orderId.substring(0, 12), // Keep it short for the SMS
        TransactionDesc: 'Aquafarm Fisheries Purchase',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa STK Push');
  }
};