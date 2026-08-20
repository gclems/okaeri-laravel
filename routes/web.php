<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DomoDevicesController;
use App\Http\Controllers\DomoEntitiesController;
use App\Http\Controllers\DomoEntityAssignmentsController;
use App\Http\Controllers\DomoEntityStatesController;
use App\Http\Controllers\DomoRoomsController;
use App\Http\Controllers\HomeArchitectController;
use App\Http\Controllers\LightingController;
use App\Http\Controllers\SunPhasesController;
use Illuminate\Support\Facades\Route;

// API
Route::get('domo-rooms', [DomoRoomsController::class, 'list'])->name('domo-rooms.list');
Route::get('domo-devices', [DomoDevicesController::class, 'list'])->name('domo-devices.list');
Route::get('domo-entities', [DomoEntitiesController::class, 'list'])->name('domo-entities.list');
Route::get('domo-entity-assignments', [DomoEntityAssignmentsController::class, 'list'])->name('domo-entity-assignments.list');
Route::get('domo-entity-states', [DomoEntityStatesController::class, 'list'])->name('domo-entity-states.list');
Route::get('sun-phases/{date}', [SunPhasesController::class, 'getByDate'])->name('sun-phases.getByDate');

Route::post('lighting/{entity}/toggle', [LightingController::class, 'toggleLight'])->name('lighting.toggleLight');

// Inertia routes
Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::post('domo-rooms', [DomoRoomsController::class, 'store'])->name('domo-rooms.store');
Route::patch('domo-rooms/{room}', [DomoRoomsController::class, 'rename'])->name('domo-rooms.rename');
Route::delete('domo-rooms/{room}', [DomoRoomsController::class, 'delete'])->name('domo-rooms.delete');

Route::get('/settings/home-architect', [HomeArchitectController::class, 'index'])->name('settings.home-architect.index');

Route::post('domo-entity-assignments', [DomoEntityAssignmentsController::class, 'store'])->name('domo-entity-assignments.store');
