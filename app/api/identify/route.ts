
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: Request) {
  const data = await request.formData();
  const image = data.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Identify this plant. Provide the following information in JSON format without any markdown formatting, YOU NEED TO STICK TO THIS PATTERN!!!, ITS IMPORTANT YOU DO EXACTLY LIKE I WANT YOU TO DO:
    {
      "name": "Common name of the plant",
      "scientificName": "Scientific name of the plant",
      "description": "Brief description of the plant",
      "careInstructions": ["List", "of", "care", "instructions"],
      "healthStatus": "Healthy OR Name of infection if infected",
      "preventiveMeasures": ["List", "of", "preventive", "measures"] (only if infected, otherwise empty array),
        "family": "Plant family",
      "origin": "Geographic origin of the plant",
      "growthRate": "Growth rate (e.g., slow, moderate, fast)",
      "maxHeight": "Maximum height the plant can reach"
    }`;

    const imageData = await image.arrayBuffer();
    const imageBytes = new Uint8Array(imageData);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageBytes).toString('base64'),
          mimeType: image.type
        }
      } 
    ]);
    const response = await result.response;
    const text = response.text();

    console.log('Raw response:', text); // Log the raw response

    // Extract JSON from the response using a more robust method
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;
    const jsonData = text.slice(jsonStartIndex, jsonEndIndex);

    console.log('Extracted JSON:', jsonData); // Log the extracted JSON

    if (jsonData) {
      try {
        const parsedData = JSON.parse(jsonData);
        return NextResponse.json(parsedData);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        return NextResponse.json({ error: 'Invalid JSON format in response' }, { status: 500 });
      }
    } else {
      console.error('No JSON data found in response');
      return NextResponse.json({ error: 'No JSON data found in response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process the image' }, { status: 500 });
  }
}