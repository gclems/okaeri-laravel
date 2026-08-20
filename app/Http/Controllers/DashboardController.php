<?php

namespace App\Http\Controllers;

use App\Models\DomoDevice;
use App\Models\DomoEntity;
use App\Models\DomoEntityAssignment;
use App\Models\DomoEntityState;
use App\Models\DomoRoom;
use App\Models\SunPhase;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $assignments = DomoEntityAssignment::all();
        $usedEntities = DomoEntity::whereIn('id', $assignments->pluck('domo_entity_id')->unique())->get();
        $usedRooms = DomoRoom::whereIn('id', $assignments->pluck('domo_room_id')->unique())->get();
        $usedDevices = DomoDevice::whereIn('ha_id', $usedEntities->pluck('ha_device_id')->unique())->get();
        $usedEntityStates = DomoEntityState::whereIn('ha_entity_id', $usedEntities->pluck('ha_id')->unique())->get();

        return Inertia::render('dashboard/index', [
            'assignments' => $assignments,
            'rooms' => $usedRooms,
            'entities' => $usedEntities,
            'devices' => $usedDevices,
            'states' => $usedEntityStates,
            'sunPhase' => SunPhase::where('date', now()->startOfDay())->first(),
        ]);
    }
}