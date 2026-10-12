import { ReactNode } from "react";

export type Skill = {
	name: string;
	iconSrc?: string;
};

export type Project = {
	name: string;
	description: string;
	date: string;
	video?: string;
	image?: string;
    links: { [name: string]: { href: string; tooltip?: string; icon?: ReactNode } };
	skills: string[];
	tags: string[];
};

export type Education = {
	name: string;
	location: string;
	date: string;
	degree: string;
	gpa: number;
	coursework: string;
	iconSrc: string;
};

export type Experience = {
	role: string;
	company: string;
	date: string;
	iconSrc: string;
	description: string;
	skills: string[];
};
