import { contactLinks, resumeName, resumeTitle } from "#/lib/resume";

export function CvHeader() {
	return (
		<header
			className="no-print border-b"
			style={{
				backgroundColor: "var(--color-surface)",
				borderColor: "var(--color-border)",
			}}
		>
			<div className="mx-auto max-w-3xl px-6 py-8">
				<h1
					className="text-4xl font-bold tracking-tight"
					style={{ color: "var(--color-text)" }}
				>
					{resumeName}
				</h1>
				<p
					className="mt-1 text-base"
					style={{ color: "var(--color-text-muted)" }}
				>
					{resumeTitle}
				</p>
				<nav
					aria-label="Contact"
					className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
				>
					{contactLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
							style={{ color: "var(--color-accent)" }}
							rel={
								link.href.startsWith("http") ? "noopener noreferrer" : undefined
							}
							target={link.href.startsWith("http") ? "_blank" : undefined}
						>
							<link.Icon size={14} aria-hidden="true" />
							<span>{link.label}</span>
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
