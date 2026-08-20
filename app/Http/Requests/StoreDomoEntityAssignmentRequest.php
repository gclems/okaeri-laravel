<?php

namespace App\Http\Requests;

use App\Domains\Domo\EntityAssignmentRoles;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDomoEntityAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => [
                'required',
                Rule::enum(EntityAssignmentRoles::class),
            ],
            'entity_id' => [
                'required',
                'exists:domo_entities,id',
            ],
            'room_id' => [
                'nullable',
                'exists:domo_rooms,id',
            ],
        ];
    }
}