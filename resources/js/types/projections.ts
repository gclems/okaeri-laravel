export type Barometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type Battery = {
readonly level: number | null,
readonly levelUnit: string | null,
readonly id: number,
};
export type ClimateSensor = {
readonly battery: Battery | null,
readonly thermometer: Thermometer | null,
readonly hygrometer: Hygrometer | null,
readonly barometer: Barometer | null,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly roomId: number | null,
};
export type Device = {
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly roomId: number | null,
readonly battery: Battery | null,
};
export type Distance = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type Entity = {
readonly id: number,
};
export type Hygrometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
export type LightBulb = {
readonly light: LightState,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
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
export type Renault4 = {
readonly battery: Battery | null,
readonly totalDistance: Distance | null,
readonly autonomy: Distance | null,
readonly id: number,
readonly name: string,
readonly isActive: boolean,
readonly roomId: number | null,
};
export type Thermometer = {
readonly value: number | null,
readonly unit: string | null,
readonly id: number,
};
