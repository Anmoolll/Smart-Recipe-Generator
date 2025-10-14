import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    if (req.method === 'GET') {
      const user = await User.findById(session.user.id)
        .populate('savedRecipes')
        .lean();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    }

    if (req.method === 'PUT') {
      const { name, dietaryPreferences } = req.body;

      const user = await User.findByIdAndUpdate(
        session.user.id,
        { name, dietaryPreferences },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

