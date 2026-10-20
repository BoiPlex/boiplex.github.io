"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const targetX = {
	experience: 33,
	projects: 77,
	socials: 174,
} as const;

const mobileArrowOffset = {
	experience: "translate-x-3",
	projects: "translate-x-2",
	socials: "translate-x-1",
} as const;

type DockGuideArrowProps = {
	label: string;
	target: keyof typeof targetX;
	className?: string;
};

export default function DockGuideArrow({
	label,
	target,
	className,
}: DockGuideArrowProps) {
	const endX = targetX[target];
	const revealOnMount = target === "experience";
	const path = `M 130 8 C 130 42 ${endX} 44 ${endX} 88 M ${endX - 10} 77`; // L ${endX} 88 L ${endX + 10} 77

	return (
		<motion.div
			initial="hidden"
			animate={revealOnMount ? "visible" : undefined}
			whileInView={revealOnMount ? undefined : "visible"}
			whileHover="hover"
			viewport={{ amount: 0.5, once: true }}
			variants={{
				hidden: { opacity: 0, y: -8 },
				visible: { opacity: 1, y: 0 },
				hover: { opacity: 1, y: 0 },
			}}
			transition={{ duration: 0.5, delay: target === "experience" ? 4 : 0 }}
			className={cn(
				"group mx-auto flex w-65 flex-col items-center pt-8",
				className,
			)}
		>
			<p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
				{label}
			</p>
			<svg
				viewBox="0 0 260 96"
				className={cn(
					"h-24 w-65 overflow-visible sm:translate-x-0",
					mobileArrowOffset[target],
				)}
				fill="none"
				aria-hidden="true"
			>
				<motion.path
					d={path}
					className="stroke-muted-foreground/35"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					variants={{
						hidden: { pathLength: 0 },
						visible: { pathLength: 1 },
						hover: { pathLength: 1 },
					}}
					transition={{ duration: 0.8, ease: "easeInOut" }}
				/>
				<motion.path
					d={path}
					className="stroke-foreground"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					variants={{
						hidden: { pathLength: 0, opacity: 0 },
						visible: { pathLength: 0, opacity: 0 },
						hover: { pathLength: 1, opacity: 1 },
					}}
					transition={{ duration: 0.65, ease: "easeInOut" }}
				/>
			</svg>
		</motion.div>
	);
}
