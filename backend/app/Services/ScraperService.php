<?php

namespace App\Services;

use GuzzleHttp\Client;
use DOMDocument;
use DOMXPath;

class ScraperService
{
    private $client;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'verify' => false,
        ]);
    }

    public function scrapeOldestArticles($count = 5)
    {
        $articles = [];
        $page = 1;
        $allArticles = [];

        // First, collect all articles by paginating
        do {
            try {
                $url = "https://beyondchats.com/blogs/?page={$page}";
                $response = $this->client->get($url);
                $html = $response->getBody()->getContents();
                
                $pageArticles = $this->parseArticles($html);
                
                if (empty($pageArticles)) {
                    break;
                }
                
                $allArticles = array_merge($allArticles, $pageArticles);
                $page++;
                
                // Safety limit
                if ($page > 50) break;
            } catch (\Exception $e) {
                break;
            }
        } while (true);

        // Sort by date (oldest first) and get last 5
        usort($allArticles, function($a, $b) {
            return strtotime($a['date'] ?? '1970-01-01') - strtotime($b['date'] ?? '1970-01-01');
        });

        // Get the 5 oldest
        $oldestArticles = array_slice($allArticles, 0, $count);

        // Scrape full content for each
        foreach ($oldestArticles as $article) {
            try {
                $fullContent = $this->scrapeArticleContent($article['url']);
                $articles[] = [
                    'title' => $article['title'],
                    'content' => $fullContent,
                    'url' => $article['url'],
                    'slug' => $this->generateSlug($article['title']),
                ];
            } catch (\Exception $e) {
                continue;
            }
        }

        return $articles;
    }

    private function parseArticles($html)
    {
        $articles = [];
        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        $xpath = new DOMXPath($dom);

        // Try multiple selectors for article links
        $selectors = [
            "//a[contains(@class, 'blog')]",
            "//article//a",
            "//div[contains(@class, 'post')]//a",
            "//h2//a",
            "//h3//a",
        ];

        foreach ($selectors as $selector) {
            $links = $xpath->query($selector);
            if ($links->length > 0) {
                foreach ($links as $link) {
                    $href = $link->getAttribute('href');
                    $title = trim($link->textContent);
                    
                    if (!empty($href) && !empty($title)) {
                        // Make URL absolute
                        if (strpos($href, 'http') !== 0) {
                            $href = 'https://beyondchats.com' . ltrim($href, '/');
                        }
                        
                        // Only add if it's a blog URL
                        if (strpos($href, '/blogs/') !== false) {
                            $articles[] = [
                                'title' => $title,
                                'url' => $href,
                                'date' => $this->extractDate($link),
                            ];
                        }
                    }
                }
                break; // Found articles with this selector
            }
        }

        return $articles;
    }

    private function scrapeArticleContent($url)
    {
        try {
            $response = $this->client->get($url);
            $html = $response->getBody()->getContents();
            
            $dom = new DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new DOMXPath($dom);

            // Try multiple selectors for article content
            $contentSelectors = [
                "//article//div[contains(@class, 'content')]",
                "//div[contains(@class, 'post-content')]",
                "//div[contains(@class, 'entry-content')]",
                "//main//div[contains(@class, 'content')]",
                "//article",
            ];

            $content = '';
            foreach ($contentSelectors as $selector) {
                $elements = $xpath->query($selector);
                if ($elements->length > 0) {
                    foreach ($elements as $element) {
                        $content .= $dom->saveHTML($element);
                    }
                    if (!empty($content)) break;
                }
            }

            // Fallback: get body content
            if (empty($content)) {
                $body = $xpath->query("//body");
                if ($body->length > 0) {
                    $content = $dom->saveHTML($body->item(0));
                }
            }

            return $content ?: 'Content could not be scraped';
        } catch (\Exception $e) {
            return 'Error scraping content: ' . $e->getMessage();
        }
    }

    private function extractDate($element)
    {
        // Try to find date in parent or sibling elements
        $parent = $element->parentNode;
        if ($parent) {
            $text = $parent->textContent;
            if (preg_match('/(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/', $text, $matches)) {
                return $matches[0];
            }
        }
        return date('Y-m-d');
    }

    private function generateSlug($title)
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        return preg_replace('/-+/', '-', $slug);
    }
}

