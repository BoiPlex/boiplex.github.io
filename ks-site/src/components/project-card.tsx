"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Project } from "@/lib/types";
import { VideoIcon } from "lucide-react";
import * as motion from "motion/react-client";

import Image from "next/image";
import Link from "next/link";
import { cloneElement, isValidElement } from "react";
import { LuGithub, LuGlobe } from "react-icons/lu";
import { SiDevpost } from "react-icons/si";

const QUALITY = 500;

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<Card className="w-sm h-full pt-0 overflow-hidden border bg-[linear-gradient(135deg,#19005a79_0%,#5c005f34_100%)]">
			<div className="relative aspect-video overflow-hidden">
				<motion.div
					className="relative size-full"
					whileHover={{ scale: 1.05 }}
				>
					{project.video ? (
						project.video[0] === "/" ? (
							<video
								className="w-full h-full aspect-video object-cover"
								src={project.video}
								autoPlay
								loop
								muted
							/>
						) : (
							<iframe
								className="w-full h-full aspect-video"
								src={project.video}
								title="YouTube video player"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							></iframe>
						)
					) : (
						<Image
							src={project.image || "/no-image.png"}
							alt={`${project.name} image`}
							fill
							className="object-cover"
						/>
					)}
				</motion.div>
			</div>
			<CardHeader>
				<div className="flex flex-col gap-2">
					<CardTitle>
						<p className="text-wrap w-5/7">{project.name}</p>

						<p className="text-secondary-foreground text-sm">
							{project.date}
						</p>
					</CardTitle>

					<CardDescription>{project.description}</CardDescription>
				</div>
				<CardAction className="absolute flex gap-4">
					{Object.entries(project.links).map(
						([name, { href, tooltip, icon }]) => (
							<Tooltip key={name}>
								<TooltipTrigger>
									<Link
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className=""
									>
										{icon ? (
											isValidElement<{
												size?: number;
											}>(icon) ? (
												cloneElement(icon, {
													size: 20,
												})
											) : (
												icon
											)
										) : name === "GitHub" ? (
											<LuGithub size={20} />
										) : name === "Demo" ? (
											<VideoIcon size={20} />
										) : name === "Devpost" ? (
											<SiDevpost size={20} />
										) : (
											<LuGlobe size={20} />
										)}
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									{tooltip || name}
								</TooltipContent>
							</Tooltip>
						),
					)}
				</CardAction>
			</CardHeader>
			<CardContent className="">
				<div className="flex flex-wrap gap-2">
					{project.skills.map((skill) => (
						<Badge key={skill} variant="secondary" className="">
							{skill}
						</Badge>
					))}
				</div>
			</CardContent>
			{/* <CardFooter className="">
				<p>Card Footer</p>
			</CardFooter> */}
		</Card>
	);
}
