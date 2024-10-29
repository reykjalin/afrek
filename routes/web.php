<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . "/auth.php";

Route::get("/", function () {
    return view("home");
});

// SPA app routes.
Route::prefix('app')->group(function () {
    Route::get("/", function () {
        return view("app");
    });

    Route::get('/login', function () {
        return view("app");
    });

    Route::get('/register', function () {
        return view("app");
    });
});

Route::get('/privacy', function () {
	return view('privacy');
});

Route::get('/blog', function () {
	return view('blog');
})->name('blog');

Route::get('/blog/introduction', function () {
	return view('blog/blog_introduction');
})->name('blog.introduction');

Route::get('/blog/2024-h2-updates', function () {
	return view('blog/2024-h2-updates');
})->name('blog.2024-h2-updates');
