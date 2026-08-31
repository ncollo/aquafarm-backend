import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { Role } from '@prisma/client';

export const seedDefaultUsers = async (): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(10);

    const usersToSeed = [
      {
        email: 'admin@aquafarm.co.ke',
        name: 'John Mwangi',
        role: Role.ADMIN,
        phone: '254712345678',
        passwordRaw: 'admin123',
      },
      {
        email: 'manager@aquafarm.co.ke',
        name: 'Grace Wanjiku',
        role: Role.MANAGER,
        phone: '254723456789',
        passwordRaw: 'manager123',
      },
    ];

    for (const u of usersToSeed) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.passwordRaw, salt);
        await prisma.user.create({
          data: {
            email: u.email,
            name: u.name,
            role: u.role,
            phone: u.phone,
            password: hashedPassword,
            isActive: true,
          },
        });
        console.log(`[Seed] Created default user: ${u.email} (${u.role})`);
      }
    }
  } catch (error) {
    console.error('[Seed] Error seeding default users:', error);
  }
};
