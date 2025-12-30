<?php

namespace App\Models;

use App\Database\MongoDBConnection;
use MongoDB\BSON\ObjectId;

class Article
{
    public $collection;

    public function __construct()
    {
        $this->collection = MongoDBConnection::getDatabase()->selectCollection('articles');
    }
    
    public static function getCollection()
    {
        return MongoDBConnection::getDatabase()->selectCollection('articles');
    }

    public static function all()
    {
        $instance = new self();
        $cursor = $instance->collection->find([], ['sort' => ['created_at' => -1]]);
        $articles = [];
        foreach ($cursor as $document) {
            $articles[] = self::documentToArray($document);
        }
        return collect($articles);
    }

    public static function find($id)
    {
        $instance = new self();
        try {
            $document = $instance->collection->findOne(['_id' => new ObjectId($id)]);
            return $document ? self::documentToArray($document) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function where($field, $value)
    {
        $instance = new self();
        return new class($instance->collection, $field, $value) {
            private $collection;
            private $field;
            private $value;

            public function __construct($collection, $field, $value)
            {
                $this->collection = $collection;
                $this->field = $field;
                $this->value = $value;
            }

            public function first()
            {
                $document = $this->collection->findOne([$this->field => $this->value]);
                return $document ? Article::documentToArray($document) : null;
            }
        };
    }

    public static function create(array $data)
    {
        $instance = new self();
        $data['created_at'] = new \MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new \MongoDB\BSON\UTCDateTime();
        $result = $instance->collection->insertOne($data);
        $document = $instance->collection->findOne(['_id' => $result->getInsertedId()]);
        return new class($document) {
            private $data;

            public function __construct($document)
            {
                $this->data = Article::documentToArray($document);
            }

            public function toArray()
            {
                return $this->data;
            }

            public function update(array $data)
            {
                $this->data = array_merge($this->data, $data);
                $this->data['updated_at'] = new \MongoDB\BSON\UTCDateTime();
                $instance = new Article();
                $instance->collection->updateOne(
                    ['_id' => new \MongoDB\BSON\ObjectId($this->data['id'])],
                    ['$set' => $data]
                );
                return $this;
            }

            public function delete()
            {
                $instance = new Article();
                $instance->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($this->data['id'])]);
            }
        };
    }

    public static function documentToArray($document)
    {
        $array = [];
        foreach ($document as $key => $value) {
            if ($key === '_id') {
                $array['id'] = (string)$value;
            } elseif ($value instanceof \MongoDB\BSON\UTCDateTime) {
                $array[$key] = $value->toDateTime()->format('Y-m-d\TH:i:s.u\Z');
            } else {
                $array[$key] = $value;
            }
        }
        return $array;
    }

    public function orderBy($field, $direction = 'asc')
    {
        $sort = $direction === 'desc' ? -1 : 1;
        $cursor = $this->collection->find([], ['sort' => [$field => $sort]]);
        $articles = [];
        foreach ($cursor as $document) {
            $articles[] = self::documentToArray($document);
        }
        return collect($articles);
    }

    public static function query()
    {
        return new self();
    }
}

// Helper class for collection-like behavior
if (!class_exists('Illuminate\Support\Collection')) {
    class Collection
    {
        private $items;

        public function __construct($items = [])
        {
            $this->items = $items;
        }

        public function toArray()
        {
            return $this->items;
        }

        public function get()
        {
            return $this;
        }
    }

    if (!function_exists('collect')) {
        function collect($items = [])
        {
            return new Collection($items);
        }
    }
}
