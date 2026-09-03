<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleLightsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entities_ids' => [
                'nullable',
                'array',
            ],
            'entities_ids.*' => [
                'exists:domo_entities,id',
            ],
            'target_state' => [
                'in:on,off',
            ],
        ];
    }
}