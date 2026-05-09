<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminDatasetController extends Controller
{
    public function index()
    {
        $datasets = Dataset::all();
        return response()->json([
            'success' => true,
            'data' => $datasets
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sample_count' => 'required|integer',
            'accuracy_score' => 'required|numeric',
            'status' => 'required|in:active,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $dataset = Dataset::create([
            'name' => $request->name,
            'description' => $request->description,
            'sample_count' => $request->sample_count,
            'accuracy_score' => $request->accuracy_score,
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dataset record created successfully',
            'data' => $dataset
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $dataset = Dataset::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:active,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $dataset->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Dataset updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $dataset = Dataset::findOrFail($id);
        $dataset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dataset record deleted'
        ]);
    }
}
