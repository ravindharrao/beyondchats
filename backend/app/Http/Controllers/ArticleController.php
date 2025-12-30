<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\ScraperService;

class ArticleController extends Controller
{
    public function index($request = null)
    {
        try {
            $articles = Article::all();
            return $articles->toArray();
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function show($request, $id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                http_response_code(404);
                return ['error' => 'Article not found'];
            }
            return $article;
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function store($request)
    {
        try {
            $validated = $request->all();
            
            if (empty($validated['title']) || empty($validated['content']) || empty($validated['url'])) {
                http_response_code(400);
                return ['error' => 'Title, content, and URL are required'];
            }

            // Check if URL already exists
            $existing = Article::where('url', $validated['url'])->first();
            if ($existing) {
                http_response_code(409);
                return ['error' => 'Article with this URL already exists'];
            }

            if (empty($validated['slug'])) {
                $validated['slug'] = $this->generateSlug($validated['title']);
            }

            $article = Article::create($validated);
            http_response_code(201);
            return $article->toArray();
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function update($request, $id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                http_response_code(404);
                return ['error' => 'Article not found'];
            }
            
            $validated = $request->all();

            // If content is being updated and original_content is empty, save current content as original
            if (isset($validated['content']) && empty($article->original_content)) {
                $validated['original_content'] = $article->content;
            }

            // For MongoDB update
            $articleObj = Article::find($id);
            if (!$articleObj) {
                http_response_code(404);
                return ['error' => 'Article not found'];
            }
            
            $collection = Article::getCollection();
            $validated['updated_at'] = new \MongoDB\BSON\UTCDateTime();
            $collection->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($id)],
                ['$set' => $validated]
            );
            
            $updated = Article::find($id);
            return $updated;
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function destroy($request, $id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                http_response_code(404);
                return ['error' => 'Article not found'];
            }
            
            $collection = Article::getCollection();
            $collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
            
            return ['message' => 'Article deleted successfully'];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function scrape($request = null)
    {
        try {
            $scraper = new ScraperService();
            $articles = $scraper->scrapeOldestArticles(5);

            $created = [];
            foreach ($articles as $articleData) {
                // Check if article already exists
                $existing = Article::where('url', $articleData['url'])->first();
                
                if (!$existing) {
                    $article = Article::create([
                        'title' => $articleData['title'],
                        'content' => $articleData['content'],
                        'original_content' => $articleData['content'],
                        'url' => $articleData['url'],
                        'slug' => $articleData['slug'],
                        'is_enhanced' => false,
                    ]);
                    $created[] = $article->toArray();
                }
            }

            return [
                'message' => 'Scraping completed',
                'articles_created' => count($created),
                'articles' => $created,
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    private function generateSlug($title)
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        return preg_replace('/-+/', '-', $slug);
    }
}

