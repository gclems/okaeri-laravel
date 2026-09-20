<?php

namespace App\Models;

use App\Domains\Domo\Models\Entities\WeatherConditionType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $ha_device_id
 * @property CarbonImmutable $date
 * @property WeatherConditionType $condition
 * @property float $temperature
 * @property string $temperature_unit
 * @property int|null $humidity
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read DomoDevice|null $device
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereHaDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereHumidity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereTemperature($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereTemperatureUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherHourlyForecast whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class WeatherHourlyForecast extends Model
{
    protected $fillable = [
        'ha_device_id',
        'date',
        'condition',
        'temperature',
        'temperature_unit',
        'humidity',
    ];

    public function casts(): array
    {
        return [
            'date' => 'datetime',
            'condition' => WeatherConditionType::class,
            'temperature' => 'float',
            'humidity' => 'integer',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(DomoDevice::class, 'ha_device_id', 'ha_id');
    }
}
