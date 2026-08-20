<?php

namespace App\Domains\Domo;

enum EntityAssignmentRoles: string
{
    // Philips Hue
    case HueLight = 'hue_light';
    case HueLightGroup = 'hue_light_group';
    // Aqara
    case AqaraThermometer = 'aqara_thermometer';
    case AqaraHygrometer = 'aqara_hygrometer';
    case AqaraBarometer = 'aqara_barometer';
    case AqaraBattery = 'aqara_battery';
    // Renault 4
    case RenaultGpsTracker = 'renault_gps_tracker';
    case RenaultTotalDistance = 'renault_total_distance';
    case RenaultBattery = 'renault_battery';
    case RenaultAutonomy = 'renault_autonomy';
    case RenaultPlugState = 'renault_plug_state';
    case RenaultChargingState = 'renault_charging_state';
    case RenaultRemainingChargingTime = 'renault_remaining_charging_time';
    case RenaultChargeLevelTarget = 'renault_charge_level_target';
}
