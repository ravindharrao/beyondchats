import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

class GoogleSearchService {
    async search(query, numResults = 10) {
        if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
            console.warn('Google API credentials not set. Using fallback search.');
            return this.fallbackSearch(query, numResults);
        }

        try {
            const url = 'https://www.googleapis.com/customsearch/v1';
            const params = {
                key: GOOGLE_API_KEY,
                cx: SEARCH_ENGINE_ID,
                q: query,
                num: numResults,
            };

            const response = await axios.get(url, { params });
            
            if (response.data.items) {
                return response.data.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Google Search API error:', error.message);
            return this.fallbackSearch(query, numResults);
        }
    }

    async fallbackSearch(query, numResults) {
        // Fallback: Use DuckDuckGo HTML search
        try {
            const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
            });

            const results = [];
            const linkRegex = /<a class="result__a" href="([^"]+)">([^<]+)<\/a>/g;
            let match;
            let count = 0;

            while ((match = linkRegex.exec(response.data)) !== null && count < numResults) {
                const link = match[1];
                const title = match[2];
                
                // Filter for blog/article URLs
                if (this.isBlogUrl(link)) {
                    results.push({
                        title: title,
                        link: link,
                        snippet: '',
                    });
                    count++;
                }
            }

            return results;
        } catch (error) {
            console.error('Fallback search error:', error.message);
            return [];
        }
    }

    isBlogUrl(url) {
        const blogIndicators = ['/blog/', '/article/', '/post/', '/news/', '/story/'];
        const excludeDomains = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'];
        
        const lowerUrl = url.toLowerCase();
        
        // Exclude social media
        if (excludeDomains.some(domain => lowerUrl.includes(domain))) {
            return false;
        }
        
        // Check for blog indicators
        return blogIndicators.some(indicator => lowerUrl.includes(indicator));
    }

    async getTopBlogArticles(query, count = 2) {
        const results = await this.search(query, 20);
        return results.slice(0, count);
    }
}

export default new GoogleSearchService();

