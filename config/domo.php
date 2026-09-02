<?php

return [
    'sun-phase' => [
        'keep_before' => env('DOMO_SUN_PHASE_KEEP_BEFORE', 7), // days
        'keep_after' => env('DOMO_SUN_PHASE_KEEP_AFTER', 7), // days
    ],
];
