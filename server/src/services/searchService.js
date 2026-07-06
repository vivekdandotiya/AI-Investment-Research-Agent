import axios from 'axios';

// is function se internet search chalta hai Tavily API se
export async function searchWeb(query) {
  const apiKey = process.env.TAVILY_API_KEY;

  // check kar rahe hain ki key hai ya nahi
  if (!apiKey || apiKey === 'your_tavily_api_key_here') {
    console.warn(`[Search Service] Tavily key nahi mili, simulated search ho rha query: "${query}"`);
    return {
      query,
      results: [
        {
          title: `Simulated result for ${query}`,
          content: `Real-time search results for "${query}" are simulated because the Tavily API key was not configured. Standard web intelligence models will rely on underlying LLM knowledge bases.`,
          url: 'https://simulated-search.local'
        }
      ],
      answer: `This is a simulated answer for search query: "${query}". Please configure a TAVILY_API_KEY in the server/.env file for live production research.`
    };
  }

  try {
    // Tavily API hit kar rahe hain query bhejkar
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    });

    return {
      query,
      results: response.data.results || [],
      answer: response.data.answer || ''
    };
  } catch (error) {
    console.error(`[Search Service] Tavily search me dikkat aayi query: "${query}":`, error.message);
    // error aane par khali result bhej do taaki code crash na ho
    return {
      query,
      results: [],
      answer: '',
      error: error.message
    };
  }
}
