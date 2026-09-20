export type Barometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type Battery = {
readonly unit: string,
readonly value: number | null,
readonly id: number,
};
export type BooleanValue = {
readonly value: boolean | null,
readonly id: number,
};
export type Car = {
readonly mileage: Distance | null,
readonly autonomy: Distance | null,
readonly isPlugged: BooleanValue,
readonly isCharging: BooleanValue,
readonly coordinates: Coordinates | null,
readonly targetChargeLevel: Battery | null,
readonly energyFlapOpened: BooleanValue,
readonly remainingChargingMinutes: IntegerValue,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type ClimateSensor = {
readonly thermometer: Thermometer | null,
readonly hygrometer: Hygrometer | null,
readonly barometer: Barometer | null,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type Coordinates = {
readonly latitude: number | null,
readonly longitude: number | null,
readonly id: number,
};
export type DayWeatherForecast = {
readonly date: string,
readonly condition: WeatherConditionType | null,
readonly temperature: number | null,
readonly temperatureLow: number | null,
readonly temperatureUnit: string | null,
readonly humidity: number | null,
readonly id: number,
};
export type Device = {
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type DeviceType = 'light_bulb' | 'climate_sensor' | 'car' | 'switch' | 'weather_forecast';
export type Distance = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type Entity = {
readonly id: number,
};
export type HourWeatherForecast = {
readonly date: string,
readonly condition: WeatherConditionType | null,
readonly temperature: number | null,
readonly temperatureUnit: string | null,
readonly humidity: number | null,
readonly id: number,
};
export type Hygrometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type IntegerValue = {
readonly value: number | null,
readonly id: number,
};
export type LightBulb = {
readonly light: LightState,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type LightState = {
readonly isOn: boolean,
readonly supportsColor: boolean,
readonly brightness: number | null,
readonly rgb: string | null,
readonly id: number,
};
export type Percentage = {
readonly unit: string,
readonly value: number | null,
readonly id: number,
};
export type Precipitation = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type SwitchDevice = {
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type Thermometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type WeatherCondition = {
readonly condition: WeatherConditionType | null,
readonly id: number,
};
export type WeatherConditionType = 'sunny' | 'clear-night' | 'partlycloudy' | 'cloudy' | 'fog' | 'windy' | 'windy-variant' | 'rainy' | 'pouring' | 'lightning' | 'lightning-rainy' | 'hail' | 'snowy' | 'snowy-rainy' | 'exceptional';
export type WeatherForecast = {
readonly temperature: Thermometer | null,
readonly humidity: Hygrometer | null,
readonly pressure: Barometer | null,
readonly windSpeed: WindSpeed | null,
readonly windGust: WindSpeed | null,
readonly dailyPrecipitation: Precipitation | null,
readonly cloudCover: Percentage | null,
readonly freezeChance: Percentage | null,
readonly rainChance: Percentage | null,
readonly snowChance: Percentage | null,
readonly uvIndex: IntegerValue | null,
readonly condition: WeatherCondition | null,
readonly dailyForecasts: DayWeatherForecast[],
readonly hourlyForecasts: HourWeatherForecast[],
readonly minTemperature: Thermometer | null,
readonly maxTemperature: Thermometer | null,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly type: DeviceType,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type WindSpeed = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
