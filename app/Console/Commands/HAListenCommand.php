<?php

namespace App\Console\Commands;

use App\Domains\HomeAssistant\HADaemon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('ha:listen')]
#[Description('Opens a websocket connection to Home Assistant and listens for events')]
class HAListenCommand extends Command
{
    public function handle(
        HADaemon $daemon,
    ) {
        $daemon->run();

        return self::SUCCESS;
    }
}