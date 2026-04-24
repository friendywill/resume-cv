import { createFileRoute } from "@tanstack/react-router";
import { marked } from "marked";
import { CvHeader } from "#/components/cv/CvHeader";
import resumeRaw from "../../RESUME.md?raw";

const bodyMarkdown = resumeRaw.replace(/^#[^\n]*\n/, "").trimStart();
const bodyHtml = marked.parse(bodyMarkdown) as string;

export const Route = createFileRoute("/")({
	component: CvPage,
});

function CvPage() {
	return (
		<div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
			<CvHeader />
			<main className="mx-auto max-w-3xl px-6 pb-16 pt-10">
				<article
					className="prose prose-slate dark:prose-invert max-w-none"
					dangerouslySetInnerHTML={{ __html: bodyHtml }}
				/>
			</main>
		</div>
	);
}
