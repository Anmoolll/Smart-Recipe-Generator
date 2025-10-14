import vision, { ImageAnnotatorClient } from '@google-cloud/vision';

let visionClient: ImageAnnotatorClient | null = null;

export function getVisionClient() {
  if (!visionClient) {
    // Initialize the client with credentials
    visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  return visionClient;
}

export interface DetectedLabel {
  description: string;
  score: number;
}

export async function detectIngredients(imageBuffer: Buffer): Promise<DetectedLabel[]> {
  try {
    const client = getVisionClient();
    
    const [result] = await client.labelDetection({
      image: { content: imageBuffer },
    });

    const labels = result.labelAnnotations || [];

    // Filter for food-related labels
    const foodKeywords = [
      'food', 'ingredient', 'vegetable', 'fruit', 'meat', 'dairy',
      'grain', 'spice', 'herb', 'seafood', 'poultry', 'produce',
    ];

    const detectedIngredients = labels
      .filter((label) => {
        const description = label.description?.toLowerCase() || '';
        return (
          foodKeywords.some((keyword) => description.includes(keyword)) ||
          label.score! > 0.85
        );
      })
      .map((label) => ({
        description: label.description || '',
        score: label.score || 0,
      }))
      .slice(0, 10); // Limit to top 10

    return detectedIngredients;
  } catch (error) {
    console.error('Vision API error:', error);
    throw new Error('Failed to analyze image');
  }
}

export async function detectText(imageBuffer: Buffer): Promise<string[]> {
  try {
    const client = getVisionClient();
    
    const [result] = await client.textDetection({
      image: { content: imageBuffer },
    });

    const detections = result.textAnnotations || [];
    
    if (detections.length > 0) {
      // First detection is usually the full text
      const fullText = detections[0].description || '';
      return fullText.split('\n').filter(text => text.trim().length > 0);
    }

    return [];
  } catch (error) {
    console.error('Vision API text detection error:', error);
    return [];
  }
}

