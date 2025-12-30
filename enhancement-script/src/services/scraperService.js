import axios from 'axios';
import * as cheerio from 'cheerio';

class ScraperService {
    async scrapeArticle(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                timeout: 30000,
            });

            const $ = cheerio.load(response.data);

            // Remove unwanted elements
            $('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar').remove();

            // Try multiple selectors for main content
            const contentSelectors = [
                'article',
                '.post-content',
                '.entry-content',
                '.article-content',
                '.content',
                'main',
                '.main-content',
            ];

            let content = '';
            for (const selector of contentSelectors) {
                const element = $(selector).first();
                if (element.length > 0) {
                    content = element.html() || element.text();
                    if (content && content.length > 500) {
                        break;
                    }
                }
            }

            // Fallback to body if no content found
            if (!content || content.length < 500) {
                $('script, style, nav, header, footer, aside').remove();
                content = $('body').html() || $('body').text();
            }

            // Clean up the content
            content = this.cleanContent(content);

            return {
                url,
                content,
                title: $('title').text() || $('h1').first().text(),
            };
        } catch (error) {
            console.error(`Error scraping ${url}:`, error.message);
            return {
                url,
                content: `Error scraping content: ${error.message}`,
                title: '',
            };
        }
    }

    cleanContent(html) {
        if (!html) return '';

        // Remove excessive whitespace
        let cleaned = html.replace(/\s+/g, ' ');
        
        // Remove HTML comments
        cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
        
        // Remove script and style tags if still present
        cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
        cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
        
        return cleaned.trim();
    }

    extractTextContent(html) {
        const $ = cheerio.load(html);
        return $('body').text().replace(/\s+/g, ' ').trim();
    }
}

export default new ScraperService();

