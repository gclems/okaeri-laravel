// ['not_in_charge', 'waiting_for_a_planned_charge', 'charge_ended', 'waiting_for_current_charge', 'energy_flap_opened', 'charge_in_progress', 'v2l_connected', 'v2g_charging_normal', 'v2g_charging_waiting', 'v2g_discharging', 'charge_error', 'unavailable']
export function getChargingStateLabel(plugState: string) {
	switch (plugState) {
		case "not_in_charge":
			return "Pas en charge";
		case "waiting_for_a_planned_charge":
			return "En attente d'une charge planifiée";
		case "charge_ended":
			return "Charge terminée";
		case "waiting_for_current_charge":
			return "En attente d'une charge en cours";
		case "energy_flap_opened":
			return "Trappe de charge ouverte";
		case "charge_in_progress":
			return "Charge en cours";
		case "v2l_connected":
			return "V2L connecté";
		case "v2g_charging_normal":
			return "V2G charge normale";
		case "v2g_charging_waiting":
			return "V2G charge en attente";
		case "v2g_discharging":
			return "V2G décharge";
		case "charge_error":
			return "Erreur de charge";
		case "unavailable":
			return "Indisponible";
		default:
			return "État de charge inconnu";
	}
}
