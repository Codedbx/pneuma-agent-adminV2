<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Platform Settings


// Packages
Route::prefix('packages')->group(function () {
    Route::get('/', [PackageController::class, 'index']);
    Route::get('/{id}', [PackageController::class, 'show']);
    Route::post('/', [PackageController::class, 'store']);
    Route::put('/{id}', [PackageController::class, 'update']);
    Route::delete('/{id}', [PackageController::class, 'destroy']);
    Route::post('/{id}/calculate-price', [PackageController::class, 'calculatePrice']);
});

//booking end point for guest users and authenticated users

// Route::post('/bookings', function(Request $request) {
//     return response()->json([
//         'status' => 'error',
//         'message' => 'This endpoint is deprecated. Please use the BookingController instead.',
//         'data' => $request->all(),
//     ], 410);
// })->name('api.bookings.store');
Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
// Route::get('/bookings/{id}', [BookingController::class, 'show'])->name('api.bookings.show'); 


// Your existing payment routes
Route::post('initiate/{bookingRef}', [PaymentController::class, 'initiate']);
Route::get('verify/{reference}', [PaymentController::class, 'verify']);
Route::post('webhook', [PaymentController::class, 'webhook']);

// Espees callback routes
Route::get('espees/success', [PaymentController::class, 'espeesSuccess'])->name('payment.espees.success');
Route::get('espees/failed', [PaymentController::class, 'espeesFailed'])->name('payment.espees.failed');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/bookings', [BookingController::class, 'index'])->name('api.bookings.index');

    Route::middleware('role:admin')->group(function () {
        Route::patch('/bookings/{id}/confirm', [BookingController::class, 'confirm'])->name('api.bookings.confirm');
    });

    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel'])->name('api.bookings.cancel');

    // Example of a route requiring a specific permission (e.g., if 'confirm bookings' is a permission, not just an admin role)
    // Route::patch('/bookings/{id}/confirm', [BookingController::class, 'confirm'])->name('api.bookings.confirm.permission')->middleware('permission:confirm bookings');
});




// For testing purposes - authenticated user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
