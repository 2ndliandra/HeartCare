<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminArticleController extends Controller
{
    private function resolveCategory(string $categoryId): ?Category
    {
        return Category::all()->first(function (Category $category) use ($categoryId) {
            return (string) ($category->_id ?? $category->id) === $categoryId
                || (string) ($category->id ?? '') === $categoryId
                || (string) ($category->slug ?? '') === $categoryId;
        });
    }

    public function index()
    {
        $articles = Article::with(['author', 'categoryRelation'])->orderBy('created_at', 'desc')->paginate(10);

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
            'category' => 'nullable|string',
            'category_id' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,published',
            'author_id' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $category = $this->resolveCategory((string) $request->category_id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori artikel tidak valid.',
                'errors' => ['category_id' => ['Kategori artikel tidak valid.']],
            ], 422);
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
            'category_id' => (string) ($category->_id ?? $category->id),
            'category' => (string) $category->name,
            'thumbnail' => $thumbnailUrl,
            'status' => $request->status,
            'author_id' => $request->author_id ?? auth()->id(),
        ]);

        $article->load(['author', 'categoryRelation']);

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
            'category' => 'sometimes|nullable|string',
            'category_id' => 'sometimes|string',
            'thumbnail' => 'sometimes|nullable',
            'status' => 'sometimes|in:draft,published',
            'author_id' => 'sometimes|nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        if ($request->has('title')) {
            $article->title = $request->title;
            $article->slug = Str::slug($request->title);
        }
         if ($request->has('content')) $article->content = $request->content;
        if ($request->has('raw_content')) $article->raw_content = $request->raw_content;
        if ($request->has('category_id')) {
            $category = $this->resolveCategory((string) $request->category_id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori artikel tidak valid.',
                    'errors' => ['category_id' => ['Kategori artikel tidak valid.']],
                ], 422);
            }

            $article->category_id = (string) ($category->_id ?? $category->id);
            $article->category = (string) $category->name;
        } elseif ($request->has('category')) {
            $article->category = (string) $request->category;
        }
        if ($request->has('author_id')) $article->author_id = $request->author_id;

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $article->thumbnail = url('storage/' . $path);
        } elseif ($request->has('thumbnail') && is_string($request->thumbnail)) {
            $article->thumbnail = $request->thumbnail;
        }

        if ($request->has('status')) $article->status = $request->status;

        $article->save();

        $article->load(['author', 'categoryRelation']);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully'
        ]);
    }

    public function show($slug)
    {
        $article = Article::where('slug', (string) $slug)->with(['author', 'categoryRelation'])->first();

        if (!$article) {
            return response()->json(['success' => false, 'message' => 'Artikel tidak ditemukan'], 404);
        }

        return (new ArticleResource($article))->additional([
            'success' => true
        ]);
    }

    public function markAsRead($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan',
            ], 404);
        }

        $user = Auth::user();
        $readArticles = is_array($user->read_article ?? null) ? $user->read_article : [];
        $articleId = (string) ($article->_id ?? $article->id);

        if (!in_array($articleId, $readArticles, true)) {
            $readArticles[] = $articleId;
            $user->read_article = $readArticles;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Artikel ditandai sudah dibaca',
            'data' => [
                'read_article' => $user->read_article ?? [],
            ],
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }
}
