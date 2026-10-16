<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ToggleRoomsLightsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rooms_ids' => [
                'required',
                'array',
            ],
            'rooms_ids.*' => [
                'exists:domo_rooms,id',
            ],
            'target_state' => [
                'required',
                'in:on,off',
            ],
        ];
    }
}
