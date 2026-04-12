<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class AdminArticleController extends Controller
{
    /**
     * Display a listing of articles with caching.
     */
    public function index()
    {
        $page = request()->get('page', 1);
        $cacheKey = "articles_list_page_{$page}";

        $articles = Cache::remember($cacheKey, 600, function () {
            return Article::with('author')->orderBy('created_at', 'desc')->paginate(10);
        });

        return ArticleResource::collection($articles)->additional([
            'success' => true,
            'pagination' => [
                'total' => $articles->total(),
                'per_page' => $articles->perPage(),
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastpage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required',
            'raw_content' => 'nullable',
            'category' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $thumbnailUrl = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $thumbnailUrl = url('storage/' . $path);
        }

        $article = Article::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'raw_content' => $request->raw_content,
            'category' => (string) $request->category,
            'thumbnail' => $thumbnailUrl,
            'status' => $request->status,
            'author_id' => auth()->id(),
        ]);

        // Invalidate cache
        $this->clearArticleCache();

        return (new ArticleResource($article))->additional([
            'success' => true,
            'message' => 'Article created successfully',
        ])->response()->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes',
            'raw_content' => 'sometimes',
            'category' => 'sometimes',
            'thumbnail' => 'sometimes|nullable',
            'status' => 'sometimes|in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        if ($request->has('title')) {
            $article->title = $request->title;
            $article->slug = Str::slug($request->title);
        }
        if ($request->has('content')) $article->content = $request->content;
        if ($request->has('raw_content')) $article->raw_content = $request->raw_content;
        if ($request->has('category')) $article->category = (string) $request->category;
        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $article->thumbnail = url('storage/' . $path);
        } elseif ($request->has('thumbnail') && is_string($request->thumbnail)) {
             $article->thumbnail = $request->thumbnail;
        }

        if ($request->has('status')) $article->status = $request->status;
        
        $article->save();

        // Invalidate cache
        $this->clearArticleCache($article->slug);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully'
        ]);
    }

    /**
     * Get a single article with caching by slug.
     */
    public function show($slug)
    {
        $cacheKey = "article_detail_{$slug}";

        $article = Cache::remember($cacheKey, 3600, function () use ($slug) {
            return Article::where('slug', (string) $slug)->with('author')->first();
        });

        if (!$article) {
            return response()->json(['success' => false, 'message' => 'Artikel tidak ditemukan'], 404);
        }
        
        return (new ArticleResource($article))->additional([
            'success' => true
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $slug = $article->slug;
        $article->delete();

        // Invalidate cache
        $this->clearArticleCache($slug);

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }

    /**
     * Helper to clear article caches.
     */
    protected function clearArticleCache($slug = null)
    {
        // Clear paginated lists (first few pages)
        for ($i = 1; $i <= 5; $i++) {
            Cache::forget("articles_list_page_{$i}");
        }
        
        if ($slug) {
            Cache::forget("article_detail_{$slug}");
        }
        
        // Also clear landing page cache if implemented elsewhere
        Cache::forget('latest_articles_home');
    }
}
