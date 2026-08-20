<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeArchitectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render(
            'settings/home-architect/index'
        );
    }
}
