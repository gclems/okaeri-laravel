<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/icons/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16">
        <link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32">
        <link rel="apple-touch-icon" href="/icons/favicon-180x180.png" type="image/png" sizes="180x180">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
