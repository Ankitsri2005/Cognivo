import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are an AI assistant helping a college student organize their life using the Eisenhower Matrix.
    Analyze the following brain-dump text and extract actionable tasks/goals.
    Classify each item into one of the four quadrants:
    - 'q1': Urgent & Important (Do First - e.g., impending deadlines, crises)
    - 'q2': Not Urgent & Important (Schedule - e.g., long-term goals, health, learning)
    - 'q3': Urgent & Not Important (Delegate - e.g., interruptions, some meetings/emails)
    - 'q4': Not Urgent & Not Important (Eliminate - e.g., time wasters, busywork)

    Also assign a priority to each item: 'urgent', 'high', 'medium', or 'low'.

    Format the output strictly as a JSON array of objects with keys: 'text', 'quadrant', 'priority'.
    Do not wrap the JSON in markdown code blocks, just return the raw JSON array.

    Input text:
    """
    ${text}
    """
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let tasks;
    try {
      tasks = JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', cleanedText);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return Response.json({ tasks });

  } catch (error) {
    console.error('Brain dump API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
