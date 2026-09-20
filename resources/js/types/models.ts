export interface DomoDevice {
  // columns
  id: number
  ha_id: number
  ha_area_id: number | null
  name: string
  is_active: boolean
  is_virtual: boolean
  created_at: string | null
  updated_at: string | null
  raw?: Array<unknown> | null
  manufacturer: string | null
  model: string | null
  // relations
  entities?: DomoEntity[]
  room?: DomoRoom
  // counts
  entities_count?: number
  // exists
  entities_exists?: boolean
  room_exists?: boolean
}

export interface DomoEntity {
  // columns
  id: number
  ha_id: string
  ha_device_id: string
  name: string
  created_at: string | null
  updated_at: string | null
  raw?: Array<unknown> | null
  platform: string | null
  // mutators
  domain: unknown
  // relations
  device?: DomoDevice
  state?: DomoEntityState
  state_histories?: DomoEntityStateHistory[]
  assignments?: DomoEntityAssignment[]
  // counts
  state_histories_count?: number
  assignments_count?: number
  // exists
  device_exists?: boolean
  state_exists?: boolean
  state_histories_exists?: boolean
  assignments_exists?: boolean
}

export interface DomoEntityAssignment {
  // columns
  id: number
  domo_entity_id: number
  domo_room_id: number | null
  role: EntityAssignmentRolesEnum
  created_at: string | null
  updated_at: string | null
  // relations
  entity?: DomoEntity
  room?: DomoRoom
  // counts
  // exists
  entity_exists?: boolean
  room_exists?: boolean
}

export interface DomoEntityState {
  // columns
  id: number
  ha_entity_id: string
  value: string
  created_at: string | null
  updated_at: string | null
  raw?: Array<unknown> | null
  // overrides
  attributes: Record<string, unknown>
  // relations
  entity?: DomoEntity
  // counts
  // exists
  entity_exists?: boolean
}

export interface DomoEntityStateHistory {
  // columns
  id: number
  ha_entity_id: string
  value: string
  raw?: Array<unknown> | null
  created_at: string | null
  updated_at: string | null
  // overrides
  attributes: Record<string, unknown>
  // relations
  entity?: DomoEntity
  // counts
  // exists
  entity_exists?: boolean
}

export interface DomoRoom {
  // columns
  id: number
  ha_id: number
  name: string
  created_at: string | null
  updated_at: string | null
  raw?: Array<unknown> | null
  // relations
  devices?: DomoDevice[]
  assignments?: DomoEntityAssignment[]
  // counts
  devices_count?: number
  assignments_count?: number
  // exists
  devices_exists?: boolean
  assignments_exists?: boolean
}

export interface SunPhase {
  // columns
  id: number
  date: string
  sunrise_starts_at: string
  sunrise_azimuth: number
  sunset_starts_at: string
  sunset_azimuth: number
  solar_noon_at: string
  solar_noon_disc_centre_elevation: number
  solar_midnight_at: string
  solar_midnight_disc_centre_elevation: number
  created_at: string | null
  updated_at: string | null
}

export interface WeatherDailyForecast {
  // columns
  id: number
  ha_device_id: string
  date: string
  condition: WeatherConditionTypeEnum
  temperature: number
  temperature_low: number
  temperature_unit: string
  humidity: number | null
  created_at: string | null
  updated_at: string | null
  // relations
  device?: DomoDevice
  // counts
  // exists
  device_exists?: boolean
}

export interface WeatherHourlyForecast {
  // columns
  id: number
  ha_device_id: string
  date: string
  condition: WeatherConditionTypeEnum
  temperature: number
  temperature_unit: string
  humidity: number | null
  created_at: string | null
  updated_at: string | null
  // relations
  device?: DomoDevice
  // counts
  // exists
  device_exists?: boolean
}

export enum EntityAssignmentRoles {
  HueLight = 'hue_light',
  HueLightGroup = 'hue_light_group',
  AqaraThermometer = 'aqara_thermometer',
  AqaraHygrometer = 'aqara_hygrometer',
  AqaraBarometer = 'aqara_barometer',
  AqaraBattery = 'aqara_battery',
  RenaultGpsTracker = 'renault_gps_tracker',
  RenaultTotalDistance = 'renault_total_distance',
  RenaultBattery = 'renault_battery',
  RenaultAutonomy = 'renault_autonomy',
  RenaultPlugState = 'renault_plug_state',
  RenaultChargingState = 'renault_charging_state',
  RenaultRemainingChargingTime = 'renault_remaining_charging_time',
  RenaultChargeLevelTarget = 'renault_charge_level_target',
}

export type EntityAssignmentRolesEnum = `${EntityAssignmentRoles}`

export enum WeatherConditionType {
  Sunny = 'sunny',
  ClearNight = 'clear-night',
  PartlyCloudy = 'partlycloudy',
  Cloudy = 'cloudy',
  Fog = 'fog',
  Windy = 'windy',
  WindyVariant = 'windy-variant',
  Rainy = 'rainy',
  Pouring = 'pouring',
  Lightning = 'lightning',
  LightningRainy = 'lightning-rainy',
  Hail = 'hail',
  Snowy = 'snowy',
  SnowyRainy = 'snowy-rainy',
  Exceptional = 'exceptional',
}

export type WeatherConditionTypeEnum = `${WeatherConditionType}`
