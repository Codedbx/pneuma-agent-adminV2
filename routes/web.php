<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

 use App\Http\Controllers\ActivityController;
use App\Http\Controllers\PackageController;
use App\Models\Package;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('booking/all', function () {
        return Inertia::render('booking/bookings');
    });

    Route::get('/package/create', function () {
        return Inertia::render('createPackage');
    })->name('package.create');

    Route::get('/invoice/all', function () {
        return Inertia::render('invoices');
    })->name('invoice.all');

     Route::get('user/create', function () {
        return Inertia::render('manage-user/createUser');
    })->name('user.create');


    // Route::get('package/all', function () {
    //     return Inertia::render('package/allPackage');
    // })->name('package.all');

    Route::get('package/edit/{id}', function ($id) {
        return Inertia::render('package/editPackage', ['id' => $id]);
    })->name('package.edit');

    Route::get('user/all', function () {
        return Inertia::render('manage-user/allUser');
    })->name('user.all');

    Route::get('user/edit/{id}', function ($id) {
        return Inertia::render('manage-user/editUser', ['id' => $id]);
    })->name('user.edit');
    

    Route::get('booking/create', function () {
        return Inertia::render('booking/createBooking');
    })->name('booking.create');

    Route::get('booking/edit/{id}', function ($id) {
        return Inertia::render('booking/editBooking', ['id' => $id]);
    })->name('booking.edit');

  


   


    Route::get('/activities/all', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/activities/create', [ActivityController::class, 'create'])->name('activities.create');
    Route::get('/activities/agent/{agent}', [ActivityController::class, 'agentActivities'])->name('activities.agent');
    Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');
    Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');



    Route::get('/packages/all', [PackageController::class, 'index'])->name('packages.index');
    Route::get('/packages/create', [PackageController::class, 'create'])->name('packages.create');
    Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');
    Route::post('/packages', [PackageController::class, 'store'])->name('packages.store');
    Route::get('/packages/edit/{package}', [PackageController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');


    
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
