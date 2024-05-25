<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tasks';

    protected $attributes = [
    	'details' => '',
    ];

    public function tags(): BelongsToMany
	{
		return $this->belongsToMany(Tag::class);
	}

	protected static function booted(): void
	{
		static::deleted(function (Task $task) {
			foreach( $task->tags as $tag ) {
				$tag->refresh();
				$task->tags()->detach($tag->id);

				if ( $tag->tasks->count() === 0 ) {
					$tag->delete();
				}
			}
		});
	}
}
