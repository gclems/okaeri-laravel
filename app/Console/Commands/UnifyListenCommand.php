<?php

namespace App\Console\Commands;

use App\Domains\Unify\UnifyDaemon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('unify:listen')]
#[Description('Polls the UniFi Network Integrations API for uplink throughput and broadcasts updates')]
class UnifyListenCommand extends Command
{
    public function handle(UnifyDaemon $daemon)
    {
        $daemon->run();

        return self::SUCCESS;
    }
}
