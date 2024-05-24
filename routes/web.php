<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . "/auth.php";

Route::get("/", function () {
    return view("home");
});

Route::get("/tasks", function () {
	return view("tasks");
});

Route::get("/login", function () {
	return view("login");
});

Route::get("/register", function () {
	return view("register");
});

Route::get('/privacy', function () {
	return view('privacy');
});

Route::get('/blog', function () {
	return view('blog');
});
