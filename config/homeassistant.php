<?php

return [
    'url' => env('HOME_ASSISTANT_URL'),
    'scheme' => env('HOME_ASSISTANT_SCHEME', 'wss'),
    'token' => env('HOME_ASSISTANT_TOKEN'),
    'latitude' => env('LATITUDE'),
    'longitude' => env('LONGITUDE'),
    'timezone' => env('TIMEZONE'),
];
