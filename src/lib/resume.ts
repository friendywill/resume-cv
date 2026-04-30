import type { LucideIcon } from "lucide-react";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

export type ContactLink = {
	label: string;
	href: string;
	Icon: LucideIcon;
};

export const resumeName = "William Friend";
export const resumeTitle =
	"IT Support Officer & System Administrator | Software Engineer";

export const contactLinks: ContactLink[] = [
	{
		label: "will@friendy.dev",
		href: "mailto:will@friendy.dev",
		Icon: Mail,
	},
	{
		label: "github.com/friendywill",
		href: "https://github.com/friendywill",
		Icon: Github,
	},
	{
		label: "linkedin.com/in/friendywill",
		href: "https://www.linkedin.com/in/friendywill/",
		Icon: Linkedin,
	},
	{
		label: "Download PDF",
		href: "/resume.pdf",
		Icon: FileText,
	},
];
