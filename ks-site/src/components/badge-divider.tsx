"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export default function BadgeDivider({ title }: { title: string }) {
	return (
		<motion.div
			initial={{opacity: 0, y: 10}}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{once: true}}
			className="flex justify-center items-center relative my-4">
			<hr className="absolute bg-gradient-to-r from-transparent via-border to-transparent h-[1px] border-0 w-full -z-1" />
			<Badge className="text-md text-secondary py-3 px-4 bg-foreground rounded-lg">
				<h3>{title}</h3>
			</Badge>
		</motion.div>
	);
}
