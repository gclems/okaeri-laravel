<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $ha_id
 * @property string $name
 * @property array<array-key, mixed>|null $payload
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantArea whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperHomeAssistantArea {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $ha_id
 * @property string|null $area_id
 * @property string|null $name
 * @property string|null $original_name
 * @property string|null $manufacturer
 * @property string|null $model
 * @property string|null $sw_version
 * @property string|null $hw_version
 * @property string|null $disabled_by
 * @property array<array-key, mixed>|null $payload
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereDisabledBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereHwVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereManufacturer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereNameByUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereSwVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantDevice whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperHomeAssistantDevice {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $ha_id
 * @property string|null $device_id
 * @property string|null $area_id
 * @property string|null $platform
 * @property string|null $name
 * @property string|null $original_name
 * @property string|null $icon
 * @property string|null $disabled_by
 * @property string|null $hidden_by
 * @property array<array-key, mixed>|null $payload
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereDisabledBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereHiddenBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereOriginalName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HomeAssistantEntity whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperHomeAssistantEntity {}
}