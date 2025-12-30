# Enhancement Script

This NodeJS script enhances articles by:
1. Fetching articles from the Laravel API
2. Searching Google for similar articles
3. Scraping top 2 reference articles
4. Using LLM to enhance the original article
5. Updating the article via API with citations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```env
LARAVEL_API_URL=http://localhost:8000/api
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
LLM_API_KEY=your_openai_api_key
LLM_PROVIDER=openai
```

3. Run the script:
```bash
npm start
```

## Getting API Keys

### Google Custom Search API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Custom Search API
4. Create credentials (API Key)
5. Create a Custom Search Engine at [Google Custom Search](https://cse.google.com/)
6. Get your Search Engine ID

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key

### Alternative: Claude API
Set `LLM_PROVIDER=claude` and use your Anthropic API key.

