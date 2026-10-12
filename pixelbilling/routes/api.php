<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ServiceLocationController;
use App\Http\Controllers\Api\V1\StaffController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        Route::get('locations', [ServiceLocationController::class, 'index'])->middleware('can.do:locations.view');
        Route::get('locations/{id}', [ServiceLocationController::class, 'show'])->middleware('can.do:locations.view');
        Route::post('locations', [ServiceLocationController::class, 'store'])->middleware('can.do:locations.manage');

        Route::get('staff', [StaffController::class, 'index'])->middleware('can.do:staff.manage');
        Route::post('staff', [StaffController::class, 'store'])->middleware('can.do:staff.manage');
    });
});
