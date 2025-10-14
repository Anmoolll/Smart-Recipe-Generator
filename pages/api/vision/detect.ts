import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import { detectIngredients } from '@/lib/vision';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(400).json({ message: 'Failed to parse form data' });
      }

      const file = files.image as File | File[] | undefined;

      if (!file) {
        return res.status(400).json({ message: 'No image provided' });
      }

      const imageFile = Array.isArray(file) ? file[0] : file;

      try {
        const imageBuffer = fs.readFileSync(imageFile.filepath);
        
        const detectedLabels = await detectIngredients(imageBuffer);

        // Clean up temp file
        fs.unlinkSync(imageFile.filepath);

        return res.status(200).json({ ingredients: detectedLabels });
      } catch (error) {
        console.error('Vision API error:', error);
        return res.status(500).json({ 
          message: 'Failed to analyze image',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  } catch (error) {
    console.error('Vision detect API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

