<?php

use App\Providers\AppServiceProvider;
use App\Providers\TypeScriptTransformerServiceProvider;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider;

return array_filter([
    AppServiceProvider::class,
    class_exists(TypeScriptTransformerApplicationServiceProvider::class)
        ? TypeScriptTransformerServiceProvider::class
        : null,
]);
