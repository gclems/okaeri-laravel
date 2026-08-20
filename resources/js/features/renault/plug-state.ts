export function getPlugStateLabel(plugState: string) {
	switch (plugState) {
		case "unplugged":
			return "Débranchée";
		case "plugged":
			return "Branchée";
		case "plugged_waiting_for_charge":
			return "Branchée, en attente de charge";
		case "plug_error":
			return "Erreur de branchement";
		default:
			return "État de prise inconnu";
	}
}
