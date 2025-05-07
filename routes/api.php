<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BenefitController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Attendance for employees and managers
    Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
    Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
    
    // Employee routes
    Route::middleware('role:employee')->group(function () {
        Route::get('/customers/search', [CustomerController::class, 'search']);
        Route::post('/services', [ServiceController::class, 'store']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/receipt/{id}', [TransactionController::class, 'generateReceipt']);
    });
    
    // Manager routes
    Route::middleware('role:manager')->group(function () {
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
        
        Route::get('/sales/daily', [TransactionController::class, 'dailySales']);
        Route::get('/sales/monthly', [TransactionController::class, 'monthlySales']);
        Route::get('/sales/daily/pdf', [TransactionController::class, 'dailySalesPdf']);
        Route::get('/sales/monthly/pdf', [TransactionController::class, 'monthlySalesPdf']);
        
        Route::get('/members', [CustomerController::class, 'members']);
        Route::get('/members/{id}', [CustomerController::class, 'memberDetails']);
        Route::put('/members/{id}/approve', [CustomerController::class, 'approveMembership']);
        
        Route::get('/benefits', [BenefitController::class, 'index']);
        Route::post('/benefits', [BenefitController::class, 'store']);
        Route::put('/benefits/{id}', [BenefitController::class, 'update']);
        Route::delete('/benefits/{id}', [BenefitController::class, 'destroy']);
    });
});