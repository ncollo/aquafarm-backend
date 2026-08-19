import { imagekit } from "../config/imagekit";

export const uploadImageToImageKit = async (
  fileBuffer: Buffer,
  originalName: string,
  folder: string = "/products"
): Promise<string> => {
  try {
    
    const response = await imagekit.upload({
      file: fileBuffer, 
      fileName: originalName,
      folder: folder,
    });

    
    return response.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload image to ImageKit");
  }
};