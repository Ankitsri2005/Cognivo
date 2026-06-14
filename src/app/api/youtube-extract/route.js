import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // 1. Fetch Transcript
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(url);
    } catch (e) {
      console.error('Transcript fetch error:', e);
      return Response.json(
        { error: 'Could not fetch transcript. The video might not have captions enabled.' },
        { status: 400 }
      );
    }

    // Extract text from transcript
    const fullTranscript = transcriptItems.map((item) => item.text).join(' ');
    // Truncate if too long to save tokens (first ~15000 chars should be enough for an overview)
    const truncatedTranscript = fullTranscript.substring(0, 15000);

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'Transcript fetched, but Gemini API key is missing to extract steps.' },
        { status: 500 }
      );
    }

    // 2. Process with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analyze the following YouTube video transcript and extract a clear, actionable step-by-step roadmap or tutorial.
    Condense the information into 4-8 logical steps.
    For each step, provide a short 'title' and a brief 'description' of what needs to be done.

    Format the output strictly as a JSON array of objects with keys: 'title', 'description'.
    Do not wrap the JSON in markdown code blocks, just return the raw JSON array.

    Transcript:
    """
    ${truncatedTranscript}
    """
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let steps;
    try {
      steps = JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', cleanedText);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return Response.json({ steps });

  } catch (error) {
    console.error('YouTube extract API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
