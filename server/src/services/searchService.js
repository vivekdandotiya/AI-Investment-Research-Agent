import axios from 'axios';

/**
 * Searches the web for a given query using the Tavily Search API.
 * Falls back to a mock/simulated result if no API key is available.
 * 
 * @param {string} query - The search query
 * @returns {Promise<Object>} - Search results containing results and answers
 */
export async function searchWeb(query) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey === 'your_tavily_api_key_here') {
    console.warn(`[Search Service] Tavily API key is missing. Simulating search for: "${query}"`);
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
    console.error(`[Search Service] Tavily API search failed for query "${query}":`, error.message);
    // Fallback on search failure
    return {
      query,
      results: [],
      answer: '',
      error: error.message
    };
  }
}
