/**
 * Vercel Serverless API for Gemini Story Generation
 * Handles story generation requests for the Story Builder Bot
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      console.error('GENERATIVE_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 1.0,
        maxOutputTokens: 150,
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `API error: ${response.status} ${response.statusText}` 
      });
    }

    const result = await response.json();
    const storyText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!storyText) {
      console.error('Invalid response structure from Gemini API:', result);
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    return res.status(200).json({ story: storyText.trim() });

  } catch (error) {
    console.error('Story generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
}