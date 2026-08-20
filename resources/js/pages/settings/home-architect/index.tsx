import { Head } from "@inertiajs/react";

import { PageTitle } from "@/components/page-title";
import { useDomoStore } from "@/features/domo/domo-store";

import { AssignmentsGroupCard } from "./assignments-group-card";
import { CreateRoomCard } from "./create-room-card";

export default function Index() {
	const rooms = useDomoStore((state) => state.roomsMap).values();

	const sortedRooms = Array.from(rooms).sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	return (
		<>
			<Head title="Architecte" />
			<PageTitle title="Architecte" description="Paramétrer le dashboard" />

			<div className="@container">
				<div className="grid @lg:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @6xl:grid-cols-5 gap-4">
					<AssignmentsGroupCard title="Général" />

					{sortedRooms.map((room) => (
						<div key={room.id}>
							<AssignmentsGroupCard room={room} />
						</div>
					))}
					<CreateRoomCard />
				</div>
			</div>
		</>
	);
}
