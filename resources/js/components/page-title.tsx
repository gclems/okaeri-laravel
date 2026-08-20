function PageTitle({
	title,
	description,
	children,
}: {
	title: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<div className="mb-6 flex gap-6">
			<div className="flex-1 truncate">
				<h1 className="font-semibold text-xl truncate">{title}</h1>
				{description && (
					<p className="text-sm text-muted truncate">{description}</p>
				)}
			</div>
			<div className="shrink-0 grow-0">{children}</div>
		</div>
	);
}

export { PageTitle };
