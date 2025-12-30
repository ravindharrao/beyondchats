import dotenv from 'dotenv';
import apiService from './services/apiService.js';
import googleSearchService from './services/googleSearchService.js';
import scraperService from './services/scraperService.js';
import llmService from './services/llmService.js';

dotenv.config();

async function enhanceArticles() {
    console.log('🚀 Starting article enhancement process...\n');

    try {
        // Step 1: Fetch articles from API
        console.log('📥 Fetching articles from API...');
        const articles = await apiService.getArticles();
        
        if (!articles || articles.length === 0) {
            console.log('❌ No articles found. Please scrape articles first.');
            return;
        }

        console.log(`✅ Found ${articles.length} article(s)\n`);

        // Process each article
        for (const article of articles) {
            // Skip if already enhanced
            if (article.is_enhanced) {
                console.log(`⏭️  Skipping article "${article.title}" (already enhanced)\n`);
                continue;
            }

            console.log(`\n📝 Processing: "${article.title}"`);
            console.log('─'.repeat(50));

            try {
                // Step 2: Search Google for article title
                console.log('🔍 Searching Google for similar articles...');
                const searchResults = await googleSearchService.getTopBlogArticles(
                    article.title,
                    2
                );

                if (searchResults.length === 0) {
                    console.log('⚠️  No reference articles found. Skipping enhancement.');
                    continue;
                }

                console.log(`✅ Found ${searchResults.length} reference article(s)`);

                // Step 3: Scrape content from reference articles
                console.log('📄 Scraping content from reference articles...');
                const referenceArticles = [];

                for (const result of searchResults) {
                    console.log(`   Scraping: ${result.link}`);
                    const scraped = await scraperService.scrapeArticle(result.link);
                    referenceArticles.push({
                        title: scraped.title || result.title,
                        url: result.link,
                        content: scraped.content,
                    });
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                console.log(`✅ Scraped ${referenceArticles.length} reference article(s)`);

                // Step 4: Enhance article using LLM
                console.log('🤖 Enhancing article using LLM...');
                const enhancedContent = await llmService.enhanceArticle(
                    article,
                    referenceArticles
                );

                // Prepare references for storage
                const references = referenceArticles.map(ref => ({
                    title: ref.title,
                    url: ref.url,
                }));

                // Step 5: Update article via API
                console.log('💾 Updating article in database...');
                await apiService.updateArticle(article.id, {
                    content: enhancedContent,
                    original_content: article.original_content || article.content,
                    references: references,
                    is_enhanced: true,
                });

                console.log(`✅ Successfully enhanced article: "${article.title}"\n`);

                // Add delay between articles
                await new Promise(resolve => setTimeout(resolve, 3000));

            } catch (error) {
                console.error(`❌ Error processing article "${article.title}":`, error.message);
                console.log('Continuing with next article...\n');
            }
        }

        console.log('\n🎉 Article enhancement process completed!');

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the enhancement process
enhanceArticles();

