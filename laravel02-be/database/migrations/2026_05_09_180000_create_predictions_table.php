<?php

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
        Schema::connection('mongodb')->create('predictions', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->index('user_id');
            $table->json('input_data');
            $table->string('result_level');
            $table->double('result_score')->default(0);
            $table->json('recommendations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mongodb')->dropIfExists('predictions');
    }
};
