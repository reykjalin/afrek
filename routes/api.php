<?php

use App\Models\Tag;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/tasks', function (Request $request) {
	$tag = $request->query('tag');
	if ( ! empty( $tag ) ) {
		return Task::with('tags')
			->where('user_id', $request->user()->id)
			->whereHas('tags', function ($query) use ($tag) {
				$query->where('id', $tag);
			})
			->orderByDesc('order')
			->get();
	}

	return Task::with('tags')
		->where('user_id', $request->user()->id)
		->orderByDesc('order')
		->get();
})->middleware('auth:sanctum');

Route::get('/tags', function (Request $request) {
	return Tag::where('user_id', $request->user()->id)
		->orderBy('name')
		->get();
})->middleware('auth:sanctum');

Route::post('/tasks', function (Request $request) {
	$request->validate([]);

	$max_order = Task::where('user_id', $request->user()->id)->max('order') ?? - 1;

	$task = new Task();
	$task->description = $request->description ?? '';
	$task->user_id = $request->user()->id;
	$task->order = $max_order + 1;
	$task->save();

	$tags = $request->tags;
	if ( ! empty( $tags ) ) {
		foreach( $tags as $tag ) {
			$tag = Tag::firstOrCreate( [
				'name'    => $tag,
				'user_id' => $request->user()->id,
			] );

			$task->tags()->save( $tag );
		}
	}

	return $task;
})->middleware('auth:sanctum');

Route::patch('/tasks/update/{id}', function (Request $request, string $id) {
	$request->validate([
		'description' => 'required|string',
	]);

	$task = Task::where('user_id', $request->user()->id)->findOrFail($id);

	$task->description = $request->description ?? '';
	$task->details = $request->details ?? '';
	$task->save();

    // Clear all the tags.
    foreach( $task->tags as $tag ) {
        // Remove the tag.
        $task->tags()->detach($tag->id);

        if ( $tag->tasks()->count() === 0 ) {
            $tag->delete();
        }
    }

    // Add the new tags.
    foreach( $request->tags as $tag ) {
        $tag = Tag::firstOrCreate( [
            'name'    => $tag,
            'user_id' => $request->user()->id,
        ] );

        $task->tags()->save( $tag );
    }

    return Task::with('tags')
        ->where('user_id', $request->user()->id)
        ->where('id', $task->id)
        ->first();
})->middleware('auth:sanctum');

Route::patch('/tasks/move/{id}', function (Request $request, string $id) {
	$request->validate([
		'new_pos' => 'required|int',
	]);
	$new_pos = $request->new_pos;

	$task = Task::where('user_id', $request->user()->id)->findOrFail($id);

	if ( $new_pos < $task->order ) {
		Task::where('user_id', $request->user()->id)
			->where('order', '>=', $new_pos)
			->where('order', '<', $task->order)
			->increment('order');
	} else {
		Task::where('user_id', $request->user()->id)
			->where('order', '>', $task->order)
			->where('order', '<=', $new_pos)
			->decrement('order');
	}

	$task->order = $new_pos;
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
