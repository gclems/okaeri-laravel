import {
	EntityAssignmentRoles,
	type EntityAssignmentRolesEnum,
} from "@/types/models";

export function getDomoEntityAssignmentRoleLabel(
	role: EntityAssignmentRolesEnum,
): string {
	switch (role) {
		case EntityAssignmentRoles.HueLight:
			return "Ampoule Philips Hue";
		case EntityAssignmentRoles.HueLightGroup:
			return "Groupe d'ampoules Philips Hue";
		case EntityAssignmentRoles.AqaraThermometer:
			return "Thermomètre Aqara";
		case EntityAssignmentRoles.AqaraHygrometer:
			return "Hygromètre Aqara";
		case EntityAssignmentRoles.AqaraBarometer:
			return "Baromètre Aqara";
		case EntityAssignmentRoles.AqaraBattery:
			return "Batterie Aqara";
		case EntityAssignmentRoles.RenaultGpsTracker:
			return "Traceur GPS Renault 4";
		case EntityAssignmentRoles.RenaultTotalDistance:
			return "Distance totale Renault 4";
		case EntityAssignmentRoles.RenaultBattery:
			return "Batterie Renault 4";
		case EntityAssignmentRoles.RenaultAutonomy:
			return "Autonomie Renault 4";
		case EntityAssignmentRoles.RenaultPlugState:
			return "État de la prise Renault 4";
		case EntityAssignmentRoles.RenaultChargingState:
			return "État de charge Renault 4";
		case EntityAssignmentRoles.RenaultRemainingChargingTime:
			return "Temps de charge restant Renault 4";
		case EntityAssignmentRoles.RenaultChargeLevelTarget:
			return "Niveau de charge cible Renault 4";
		default:
			return role;
	}
}
