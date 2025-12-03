<?php

namespace App\Console;

use App\Console\Commands\ProcessPackageRenewals;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command(ProcessPackageRenewals::class)->dailyAt('00:30');
    }

    protected $commands = [
        ProcessPackageRenewals::class,
    ];
}