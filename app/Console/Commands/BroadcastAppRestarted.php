<?php

namespace App\Console\Commands;

use App\Events\AppRestarted;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:broadcast-restarted')]
#[Description('Broadcasts that the application has just started, so open clients can refresh themselves')]
class BroadcastAppRestarted extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        AppRestarted::dispatch();
    }
}
