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
 * @property float $temperature_low
 * @property string $temperature_unit
 * @property int|null $humidity
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read DomoDevice|null $device
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereHaDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereHumidity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereTemperature($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereTemperatureLow($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereTemperatureUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WeatherDailyForecast whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class WeatherDailyForecast extends Model
{
    protected $fillable = [
        'ha_device_id',
        'date',
        'condition',
        'temperature',
        'temperature_low',
        'temperature_unit',
        'humidity',
    ];

    public function casts(): array
    {
        return [
            'date' => 'date',
            'condition' => WeatherConditionType::class,
            'temperature' => 'float',
            'temperature_low' => 'float',
            'humidity' => 'integer',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(DomoDevice::class, 'ha_device_id', 'ha_id');
    }
}
