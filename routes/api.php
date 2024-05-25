<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/tasks', function (Request $request) {
	return Task::where('user_id', $request->user()->id)->orderByDesc('order')->get();
})->middleware('auth:sanctum');

Route::post('/tasks', function (Request $request) {
	$request->validate([
		'description' => 'required|string',
	]);

	$max_order = Task::where('user_id', $request->user()->id)->max('order') ?? - 1;

	$task = new Task();
	$task->description = $request->description;
	$task->user_id = $request->user()->id;
	$task->order = $max_order + 1;
	$task->save();

	return $task;
})->middleware('auth:sanctum');

Route::delete('/tasks/{id}', function (Request $request, string $id) {
	$task = Task::where('user_id', $request->user()->id)->findOrFail($id);

	Task::where('user_id', $request->user()->id)
		->where('order', '>', $task->order)
		->decrement('order');

	$task->delete();
	return response()->noContent();
})->middleware('auth:sanctum');
