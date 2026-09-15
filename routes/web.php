<?php

use App\Http\Controllers\PersonnelTypeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseVoucherController;
use App\Http\Controllers\RationVoucherCategoryController;
use App\Http\Controllers\VoucherController;
use App\Http\Middleware\EnsureUserCanAccessDashboard;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
// Customer route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('customer-profile');
    // Route::put('/profile', [ProfileController::class, 'update'])->name('customer-profile.update');

});

Route::middleware(['auth', 'verified', EnsureUserCanAccessDashboard::class])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // Product Route
    Route::get('/products', [ProductController::class, 'index'])->name('products.index')->middleware('permission::product-menu|product-view');
    Route::get('/products-list', [ProductController::class, 'show'])->name('products.show')->middleware('permission::product-menu|product-view');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create')->middleware('permission::product-menu|product-create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store')->middleware('permission::product-menu|product-create');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit')->middleware('permission::product-menu|product-edit');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update')->middleware('permission::product-menu|product-edit');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware('permission::product-menu|product-delete');
    // ration-voucher-categories route
    Route::get('/ration-voucher-categories', [RationVoucherCategoryController::class, 'index'])->name('ration-voucher-categories.index')->middleware('permission::product-menu|product-view');
    Route::get('/ration-voucher-categories-list', [RationVoucherCategoryController::class, 'show'])->name('ration-voucher-categories.show')->middleware('permission::product-menu|product-view');
    Route::get('/ration-voucher-categories/create', [RationVoucherCategoryController::class, 'create'])->name('ration-voucher-categories.create')->middleware('permission::product-menu|product-create');
    Route::post('/ration-voucher-categories', [RationVoucherCategoryController::class, 'store'])->name('ration-voucher-categories.store')->middleware('permission::product-menu|product-create');
    Route::get('/ration-voucher-categories/{id}/edit', [RationVoucherCategoryController::class, 'edit'])->name('ration-voucher-categories.edit')->middleware('permission::product-menu|product-edit');
    Route::put('/ration-voucher-categories/{id}', [RationVoucherCategoryController::class, 'update'])->name('ration-voucher-categories.update')->middleware('permission::product-menu|product-edit');
    Route::delete('/ration-voucher-categories/{id}', [RationVoucherCategoryController::class, 'destroy'])->name('ration-voucher-categories.destroy')->middleware('permission::product-menu|product-delete');
    // personnel type route
    Route::get('/personnel-types', [PersonnelTypeController::class, 'index'])->name('personnel-types.index')->middleware('permission::product-menu|product-view');
    Route::get('/personnel-types-list', [PersonnelTypeController::class, 'show'])->name('personnel-types.show')->middleware('permission::product-menu|product-view');
    Route::get('/personnel-types/create', [PersonnelTypeController::class, 'create'])->name('personnel-types.create')->middleware('permission::product-menu|product-create');
    Route::post('/personnel-types', [PersonnelTypeController::class, 'store'])->name('personnel-types.store')->middleware('permission::product-menu|product-create');
    Route::get('/personnel-types/{id}/edit', [PersonnelTypeController::class, 'edit'])->name('personnel-types.edit')->middleware('permission::product-menu|product-edit');
    Route::put('/personnel-types/{id}', [PersonnelTypeController::class, 'update'])->name('personnel-types.update')->middleware('permission::product-menu|product-edit');
    Route::delete('/personnel-types/{id}', [PersonnelTypeController::class, 'destroy'])->name('personnel-types.destroy')->middleware('permission::product-menu|product-delete');
    // vouchers route
    Route::get('/vouchers', [VoucherController::class, 'index'])->name('vouchers.index')->middleware('permission::product-menu|product-view');
    Route::get('/vouchers-list', [VoucherController::class, 'show'])->name('vouchers.show')->middleware('permission::product-menu|product-view');
    Route::get('/vouchers/create', [VoucherController::class, 'create'])->name('vouchers.create')->middleware('permission::product-menu|product-create');
    Route::post('/vouchers', [VoucherController::class, 'store'])->name('vouchers.store')->middleware('permission::product-menu|product-create');
    Route::get('/vouchers/{voucher}/view', [VoucherController::class, 'view'])->name('vouchers.view')->middleware('permission::product-menu|product-view');
    Route::get('/vouchers/{voucher}/edit', [VoucherController::class, 'edit'])->name('vouchers.edit')->middleware('permission::product-menu|product-edit');
    Route::put('/vouchers/{voucher}', [VoucherController::class, 'update'])->name('vouchers.update')->middleware('permission::product-menu|product-edit');
    Route::delete('/vouchers/{id}', [VoucherController::class, 'destroy'])->name('vouchers.destroy')->middleware('permission::product-menu|product-delete');
    // purchase-vouchers route
    Route::get('/purchase-vouchers', [PurchaseVoucherController::class, 'index'])->name('purchase-vouchers.index')->middleware('permission::product-menu|product-view');
    Route::get('/purchase-vouchers-list', [PurchaseVoucherController::class, 'show'])->name('purchase-vouchers.show')->middleware('permission::product-menu|product-view');
    Route::get('/purchase-vouchers/create', [PurchaseVoucherController::class, 'create'])->name('purchase-vouchers.create')->middleware('permission::product-menu|product-create');
    Route::post('/purchase-vouchers', [PurchaseVoucherController::class, 'store'])->name('purchase-vouchers.store')->middleware('permission::product-menu|product-create');
    Route::get('/purchase-vouchers/{purchaseVoucher}/view', [PurchaseVoucherController::class, 'view'])->name('purchase-vouchers.view')->middleware('permission::product-menu|product-view');
    Route::get('/purchase-vouchers/{purchaseVoucher}/edit', [PurchaseVoucherController::class, 'edit'])->name('purchase-vouchers.edit')->middleware('permission::product-menu|product-edit');
    Route::put('/purchase-vouchers/{purchaseVoucher}', [PurchaseVoucherController::class, 'update'])->name('purchase-vouchers.update')->middleware('permission::product-menu|product-edit');
    Route::delete('/purchase-vouchers/{purchaseVoucher}', [PurchaseVoucherController::class, 'destroy'])->name('purchase-vouchers.destroy')->middleware('permission::product-menu|product-delete');

});

require __DIR__.'/settings.php';
