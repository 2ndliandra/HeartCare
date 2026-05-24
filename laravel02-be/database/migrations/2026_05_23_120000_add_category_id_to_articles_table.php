<?php

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mongodb')->table('articles', function (Blueprint $table) {
            $table->string('category_id')->nullable()->index();
        });

        $categories = Category::all()->keyBy(function (Category $category) {
            return strtolower((string) $category->name);
        });

        $categoriesBySlug = Category::all()->keyBy(function (Category $category) {
            return strtolower((string) $category->slug);
        });

        Article::whereNotNull('category')->get()->each(function (Article $article) use ($categories, $categoriesBySlug) {
            $rawCategory = strtolower(trim((string) $article->category));
            if ($rawCategory === '' || !empty($article->category_id)) {
                return;
            }

            $matchedCategory = $categories->get($rawCategory) ?? $categoriesBySlug->get($rawCategory);
            if (!$matchedCategory) {
                return;
            }

            $article->category_id = (string) ($matchedCategory->_id ?? $matchedCategory->id);
            $article->category = (string) $matchedCategory->name;
            $article->save();
        });
    }

    public function down(): void
    {
        Schema::connection('mongodb')->table('articles', function (Blueprint $table) {
            $table->dropColumn('category_id');
        });
    }
};
