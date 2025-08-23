import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../index';

export const getBrandProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: req.user.uid },
      include: { brandProfile: true },
    });

    if (!user || !user.brandProfile) {
      return res.status(404).json({ message: 'Brand profile not found' });
    }

    res.status(200).json(user.brandProfile);
  } catch (error) {
    console.error('Error fetching brand profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertBrandProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { brandName, logoUrl, brandColors, slogan } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const brandProfile = await prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: { brandName, logoUrl, brandColors, slogan },
      create: {
        userId: user.id,
        brandName,
        logoUrl,
        brandColors,
        slogan,
      },
    });

    res.status(201).json(brandProfile);
  } catch (error) {
    console.error('Error creating/updating brand profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
