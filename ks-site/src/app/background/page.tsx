import Image from "next/image";
import type { Education, Experience, Skill } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import Icon from "@/components/icon";
import { IconCloud } from "@/components/ui/icon-cloud";
import BadgeDivider from "@/components/badge-divider";
import * as motion from "motion/react-client";
import { assetPath } from "@/lib/paths";

export const skills: Skill[] = [
	// Languages
	{ name: "JavaScript", iconSrc: "/icons/javascript.svg" },
	{ name: "TypeScript", iconSrc: "/icons/typescript-icon.svg" },
	{ name: "Python", iconSrc: "/icons/python.svg" },
	{ name: "C/C++", iconSrc: "/icons/c-plusplus.svg" },
	{ name: "Java", iconSrc: "/icons/java.svg" },

	// Libraries & Frameworks
	{ name: "React", iconSrc: "/icons/react.svg" },
	{ name: "Tailwind", iconSrc: "/icons/tailwindcss-icon.svg" },
	{ name: "Next.js", iconSrc: "/icons/nextjs-icon.svg" },
	{ name: "Node.js", iconSrc: "/icons/nodejs-icon.svg" },
	{ name: "FastAPI", iconSrc: "/icons/fastapi-icon.svg" },
	{ name: "Pandas", iconSrc: "/icons/pandas-icon.svg" },

	// Databases
	{ name: "PostgreSQL", iconSrc: "/icons/postgresql.svg" },
	{ name: "MongoDB", iconSrc: "/icons/mongodb-icon.svg" },
	{ name: "Drizzle ORM", iconSrc: "/icons/drizzle-orm-icon.svg" },

	// Tools
	{ name: "AWS", iconSrc: "/icons/aws.svg" },
	{ name: "Docker", iconSrc: "/icons/docker-icon.svg" },
	{ name: "Git", iconSrc: "/icons/git-icon.svg" },
	{ name: "Postman", iconSrc: "/icons/postman-icon.svg" },
	{ name: "Claude Code", iconSrc: "/icons/claude-code.svg" },
	{ name: "Cursor", iconSrc: "/icons/cursor-icon.svg" },

	// AI / ML
	{ name: "TensorFlow", iconSrc: "/icons/tensorflow.svg" },
	{ name: "PyTorch", iconSrc: "/icons/pytorch-icon.svg" },
];

// EDUCATION
export const education: Education = {
	name: "University of California, Davis",
	location: "Davis, CA",
	date: "Sep 2022 - May 2026",
	degree: "B.S. in Computer Science and Engineering",
	gpa: 3.5,
	coursework:
		"Data Structures & Algorithms, Software Engineering, Operating Systems, Computer Networks, Artificial Intelligence, Game Development, Database Systems, Computer Architecture, C/C++, Program Correctness, Computer Vision, Machine Learning",
	iconSrc: "/icons/ucdavis.png",
};

// WORK EXPERIENCE
export const experiences: Experience[] = [
	{
		role: "Full Stack Founding Engineer",
		company: "AislePal",
		date: "Nov 2025 - Jul 2026",
		iconSrc: "/icons/aislepal.svg",
		description:
			"Led development and launch of an AI-powered retail shopping MVP featuring barcode scanning, personalized recommendations, checkout, user tracking, and store analytics. Built authentication, payments, real-time inventory synchronization, role-based access control, and recommendation systems using matrix factorization. Tech: React, TypeScript, Next.js, PostgreSQL.",
		skills: [
			"React",
			"TypeScript",
			"Tailwind",
			"Next.js",
			"PostgreSQL",
			"Drizzle",
		],
	},
	{
		role: "Software Engineer Intern",
		company: "StudyStudio.ai",
		date: "Jan 2025 - Jun 2025",
		iconSrc: "/icons/studystudio.png",
		description:
			"Developed a real-time course progress dashboard for tracking assignments and deadlines. Built an AI-powered smart planner that automatically schedules tasks based on procrastination habits using OpenAI and PyTorch. Owned end-to-end implementation of production-ready full-stack features.",
		skills: [
			"React",
			"JavaScript",
			"Tailwind",
			"Node.js",
			"OpenAI",
			"PyTorch",
		],
	},
	{
		role: "Software Developer Intern",
		company: "Talentrica Inc",
		date: "Jun 2024 - Sep 2024",
		iconSrc: "/icons/talentrica.png",
		description:
			"Automated webinar data processing, reducing manual work by 90% and enabling instant certificate generation. Launched and maintained the company website to improve online visibility and client engagement.",
		skills: ["Python", "Pandas", "HTML", "CSS"],
	},
	{
		role: "Software Engineer Intern",
		company: "Infinite Options",
		date: "Feb 2024 - Apr 2024",
		iconSrc: "/icons/infinite-options.png",
		description:
			"Contributed to full-stack development of event registration and property management platforms. Developed React features, implemented secure user-role functionality, fixed bugs, and improved application quality.",
		skills: ["React", "JavaScript", "CSS"],
	},
];

export default function BackgroundPage() {
	return (
		<div className="mt-4 mb-8 flex w-full max-w-full flex-col items-center overflow-x-clip px-4 sm:px-6">
			{/* <div id="intro" className="flex flex-col w-3/5 mb-8">
                <BadgeDivider title="Intro" />
                <div className="flex flex-col items-center">
                    
                </div>
            </div> */}
			<div id="education" className="mb-8 flex w-full flex-col lg:w-3/5">
				<BadgeDivider title="Education" />
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex w-full flex-col gap-3 self-center sm:w-4/5 sm:flex-row sm:justify-between"
				>
					<div className="flex min-w-0 gap-3 sm:gap-4">
						<Icon
							src={education.iconSrc}
							alt={education.name + " icon"}
							size={48}
							className="shrink-0 border border-2 border-border rounded-xl overflow-hidden"
						/>
						<div className="flex min-w-0 flex-col">
							<p>{education.name}</p>
							<p className="text-secondary-foreground font-bold text-sm">
								{education.degree}
							</p>
							<p className="text-secondary-foreground text-sm sm:hidden">
								{education.date}
							</p>
							<p className="text-secondary-foreground text-sm mt-1">
								{education.coursework}
							</p>
						</div>
					</div>
					<div className="hidden min-w-fit sm:block">
						<p className="text-secondary-foreground text-sm">
							{education.date}
						</p>
					</div>
				</motion.div>
			</div>
			<div id="experience" className="mb-8 flex w-full flex-col lg:w-3/5">
				<BadgeDivider title="Experience" />
				<div className="flex flex-col gap-8">
					{experiences.map((experience) => (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							key={experience.company}
							className="flex w-full flex-col gap-3 self-center sm:w-4/5 sm:flex-row sm:justify-between"
						>
							<div className="flex min-w-0 gap-3 sm:gap-4">
								<Icon
									src={experience.iconSrc}
									alt={education.name + " icon"}
									size={48}
									className="shrink-0 border border-2 border-border rounded-xl overflow-hidden"
								/>
								<div className="flex min-w-0 flex-col">
									<p>{experience.role}</p>
									<p className="text-secondary-foreground font-bold text-sm">
										{experience.company}
									</p>
									<p className="text-secondary-foreground text-sm sm:hidden">
										{experience.date}
									</p>
									<p className="text-secondary-foreground text-sm mt-2">
										{experience.description}
									</p>
									<div className="flex flex-wrap mt-2">
										{experience.skills.map((skill) => (
											<Badge
												key={skill}
												variant="outline"
												className=""
											>
												{skill}
											</Badge>
										))}
									</div>
								</div>
							</div>
							<div className="hidden min-w-fit sm:block">
								<p className="text-secondary-foreground text-sm">
									{experience.date}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
			<div
				id="skills"
				className="flex w-full flex-col lg:w-4/5 2xl:w-3/5"
			>
				<BadgeDivider title="Skills" />
				<div className="flex w-full flex-col items-center justify-center gap-4 self-center sm:w-4/5 xl:flex-row xl:gap-8">
					<div className="flex min-w-0 flex-wrap justify-center gap-2 xl:justify-start">
						{skills.map((skill, idx) => (
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{ duration: 0.6, delay: idx * 0.1 }}
								key={skill.name}
							>
								<Badge
									variant="outline"
									className="bg-background text-sm px-3 py-4"
								>
									<Icon
										src={skill.iconSrc || "/no-image.png"}
										alt={skill.name + " icon"}
									/>
									{skill.name}
								</Badge>
							</motion.div>
						))}
					</div>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="max-w-full"
					>
						<IconCloud
							images={skills
								.filter((skill) => skill.iconSrc)
								.map((skill) => assetPath(skill.iconSrc!))}
							showControl={false}
						/>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
