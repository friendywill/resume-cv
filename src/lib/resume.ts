import { SiFiles, SiGithub, SiProtonmail } from '@icons-pack/react-simple-icons';

import { LinkedInIcon } from '#/components/icons/linkedin';
import type { CustomIconType } from '#/types/icon';

export type ContactLink = {
	label: string;
	href: string;
	Icon: CustomIconType;
};

export const resumeName = "William Friend";
export const resumeTitle =
	"IT Support Officer & System Administrator | Software Engineer";

export const contactLinks: ContactLink[] = [
	{
		label: "will@friendy.dev",
		href: "mailto:will@friendy.dev",
		Icon: SiProtonmail,
	},
	{
		label: "github.com/friendywill",
		href: "https://github.com/friendywill",
		Icon: SiGithub,
	},
	{
		label: "linkedin.com/in/friendywill",
		href: "https://www.linkedin.com/in/friendywill/",
		Icon: LinkedInIcon,
	},
	{
		label: "Download PDF",
		href: "/resume.pdf",
		Icon: SiFiles,
	},
];
