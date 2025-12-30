import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
const LLM_API_KEY = process.env.LLM_API_KEY;

class LLMService {
    constructor() {
        if (LLM_PROVIDER === 'openai' && LLM_API_KEY) {
            this.openai = new OpenAI({
                apiKey: LLM_API_KEY,
            });
        }
    }

    async enhanceArticle(originalArticle, referenceArticles) {
        if (!LLM_API_KEY) {
            console.warn('LLM API key not set. Returning original article with formatting improvements.');
            return this.formatArticle(originalArticle, referenceArticles);
        }

        try {
            if (LLM_PROVIDER === 'openai' && this.openai) {
                return await this.enhanceWithOpenAI(originalArticle, referenceArticles);
            } else if (LLM_PROVIDER === 'claude') {
                return await this.enhanceWithClaude(originalArticle, referenceArticles);
            } else {
                return this.formatArticle(originalArticle, referenceArticles);
            }
        } catch (error) {
            console.error('LLM enhancement error:', error.message);
            return this.formatArticle(originalArticle, referenceArticles);
        }
    }

    async enhanceWithOpenAI(originalArticle, referenceArticles) {
        const referenceTexts = referenceArticles.map(ref => 
            `Title: ${ref.title}\nURL: ${ref.url}\nContent: ${ref.content.substring(0, 2000)}...`
        ).join('\n\n---\n\n');

        const prompt = `You are an expert content writer. Your task is to enhance an article to match the quality, formatting, and style of top-ranking articles on Google.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content.substring(0, 3000)}...

REFERENCE ARTICLES (Top-ranking articles on Google):
${referenceTexts}

INSTRUCTIONS:
1. Enhance the original article's content while maintaining its core message and key information
2. Match the formatting style, structure, and writing quality of the reference articles
3. Improve readability, add proper headings, and organize content better
4. Keep the article informative and valuable
5. At the end, add a "References" section citing the reference articles with their URLs

Return ONLY the enhanced article content in HTML format, including proper headings, paragraphs, and formatting. Do not include any explanations or meta-commentary.`;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional content writer specializing in creating well-formatted, SEO-friendly articles.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        let enhancedContent = completion.choices[0].message.content;

        // Add references section
        enhancedContent += this.generateReferencesSection(referenceArticles);

        return enhancedContent;
    }

    async enhanceWithClaude(originalArticle, referenceArticles) {
        // Claude API implementation (using Anthropic API)
        const referenceTexts = referenceArticles.map(ref => 
            `Title: ${ref.title}\nURL: ${ref.url}\nContent: ${ref.content.substring(0, 2000)}...`
        ).join('\n\n---\n\n');

        const prompt = `You are an expert content writer. Enhance the following article to match the quality and style of top-ranking articles.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content.substring(0, 3000)}...

REFERENCE ARTICLES:
${referenceTexts}

Enhance the article while maintaining its core message. Match the formatting and style of the reference articles. Add a References section at the end.`;

        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 4000,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                },
                {
                    headers: {
                        'x-api-key': LLM_API_KEY,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json',
                    },
                }
            );

            let enhancedContent = response.data.content[0].text;
            enhancedContent += this.generateReferencesSection(referenceArticles);
            return enhancedContent;
        } catch (error) {
            console.error('Claude API error:', error.message);
            return this.formatArticle(originalArticle, referenceArticles);
        }
    }

    formatArticle(originalArticle, referenceArticles) {
        // Fallback formatting if LLM is not available
        let formatted = `<h1>${originalArticle.title}</h1>\n\n`;
        formatted += `<div class="article-content">\n${originalArticle.content}\n</div>\n\n`;
        formatted += this.generateReferencesSection(referenceArticles);
        return formatted;
    }

    generateReferencesSection(referenceArticles) {
        if (!referenceArticles || referenceArticles.length === 0) {
            return '';
        }

        let references = '\n\n<hr>\n\n<h2>References</h2>\n<ul>\n';
        referenceArticles.forEach(ref => {
            references += `  <li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a></li>\n`;
        });
        references += '</ul>\n';

        return references;
    }
}

export default new LLMService();

