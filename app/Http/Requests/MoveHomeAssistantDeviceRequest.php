<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MoveHomeAssistantDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'area_id' => [
                'nullable',
                'exists:home_assistant_areas,id',
            ],
        ];
    }
}
