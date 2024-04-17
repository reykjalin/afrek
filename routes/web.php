<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Afrek' => app()->version()];
});

require __DIR__.'/auth.php';
