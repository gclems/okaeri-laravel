<?php

namespace App\Console\Commands;

use App\Events\AppUpdated;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:broadcast-updated')]
#[Description('Broadcasts that the application has just started, so open clients can refresh themselves')]
class BroadcastAppUpdated extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        AppUpdated::dispatch();
    }
}
