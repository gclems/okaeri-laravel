<?php

namespace App\Domains\Domo;

enum DomoEventMode: string
{
    case REPLACE = 'replace';
    case MERGE = 'merge';
}
