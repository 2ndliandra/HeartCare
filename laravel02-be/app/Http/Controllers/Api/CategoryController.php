<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Get all categories with caching and resources.
     */
    public function index()
    {
        $categories = Cache::remember('all_categories', 3600, function () {
            return Category::all();
        });

        return CategoryResource::collection($categories)->additional([
            'success' => true
        ]);
    }

    /**
     * Store new category and invalidate cache.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:mongodb.categories,name|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $category = Category::create([
            'name' => (string) $request->name,
            'slug' => Str::slug($request->name),
        ]);

        // Invalidate cache
        Cache::forget('all_categories');

        return (new CategoryResource($category))->additional([
            'success' => true,
            'message' => 'Category created successfully'
        ])->response()->setStatusCode(201);
    }
}
