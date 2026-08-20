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
  ha_device_id: number
  name: string
  created_at: string | null
  updated_at: string | null
  // relations
  device?: DomoDevice
  assignments?: DomoEntityAssignment[]
  // counts
  assignments_count?: number
  // exists
  device_exists?: boolean
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
  // overrides
  attributes: Record<string, unknown>
  // relations
  entity?: DomoEntity[]
  // counts
  entity_count?: number
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
