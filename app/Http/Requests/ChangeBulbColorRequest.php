<?php

namespace App\Http\Requests;

use App\Domains\Domo\Services\LightColorCapability;
use App\Models\DomoEntity;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChangeBulbColorRequest extends FormRequest
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
            'ha_entity_id' => [
                'required',
                'string',
                'exists:domo_entities,ha_id',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $entity = DomoEntity::query()->with('state')->firstWhere('ha_id', $value);

                    if (
                        $this->filled('red')
                        && $entity !== null
                        && ! app(LightColorCapability::class)->supportsRgbColor($entity)
                    ) {
                        $fail('This entity does not support RGB colors.');
                    }
                },
            ],
            'red' => [
                'required_without:brightness',
                'required_with:green,blue',
                'integer',
                'between:0,255',
            ],
            'green' => [
                'required_with:red,blue',
                'integer',
                'between:0,255',
            ],
            'blue' => [
                'required_with:red,green',
                'integer',
                'between:0,255',
            ],
            'brightness' => [
                'nullable',
                'integer',
                'between:0,255',
            ],
        ];
    }
}
