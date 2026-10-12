"use client";

import FloatingThing from "@/components/unused/floating-thing";
import { ArrowBigRightIcon } from "lucide-react";
import Image from "next/image";
import { motion, scale } from "motion/react";
import { Button } from "@/components/ui/button";
import SimpleDashboard from "@/components/unused/dashboard-simple";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { assetPath } from "@/lib/paths";

export default function Hero() {
	return (
		<div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
			<div className="flex w-full justify-center">
				<div className="flex w-fit max-w-full flex-col gap-6">
					<div className="flex min-h-20 items-center justify-center gap-6 sm:h-[15vh]">
						<h1 className="whitespace-nowrap text-3xl min-[380px]:text-4xl sm:text-6xl">
							<TypeAnimation
								sequence={["", 2200, "Hi, I'm Karim"]}
								speed={1}
								cursor={false}
								preRenderFirstString
								className="inline-block bg-[linear-gradient(135deg,#ff007f_0%,#7f00ff_50%,#00f0ff_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
							/>
						</h1>
						{/* <motion.div
							initial={{ opacity: 0, scale: 0, x: -100 }}
							animate={{ opacity: 1, scale: 1, x: 0 }}
							transition={{
								delay: 3.5,
							}}
						>
							<ArrowBigRightIcon size={50} strokeWidth={2} />
						</motion.div> */}

						<motion.div
							initial={{ opacity: 0, scale: 0, x: -150 }}
							animate={{
								opacity: [0, 1, null],
								scale: [0, 1, null],
								rotate: [-720, 0, 360],
								x: [-150, null, 0],
							}}
							transition={{
								duration: 4,
								times: [0, 0.25, 1],
								ease: "easeInOut",
							}}
							className="shrink-0"
						>
							<div className="rounded-full border dark:border-white border-black border-2 overflow-hidden">
								<Image
									width={100}
									height={100}
									alt="pfp"
									src={assetPath("/pfp.jpg")}
									className="size-16 min-[380px]:size-18 sm:size-25"
								/>
							</div>
						</motion.div>
					</div>
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{delay: 3.5}}
						className="min-h-8 text-2xl sm:h-[5vh] sm:text-4xl"
					>
						<TypeAnimation
							sequence={["", 4500, "Have a look around"]}
							deletionSpeed={40}
							// repeat={Infinity}
							cursor={true}
							style={{ whiteSpace: "pre-line" }}
						/>
					</motion.h2>
					{/* <div className="flex justify-start gap-10 mt-6">
						<motion.div whileHover={{ scale: 1.1 }}>
							<Button className="bg-blue-700 hover:bg-blue-900 text-lg p-5">
								Background
							</Button>
						</motion.div>
						<motion.div whileHover={{ scale: 1.1 }}>
							<Button className="bg-fuchsia-700 hover:bg-fuchsia-900 text-lg p-5">
								Projects
							</Button>
						</motion.div>
						<motion.div whileHover={{ scale: 1.1 }}>
							<Button className="bg-purple-700 hover:bg-purple-900 text-lg p-5">
								Contact
							</Button>
						</motion.div>
					</div> */}
				</div>
				{/* <div className="w-2/5 justify-center">
					<SimpleDashboard />
				</div> */}
			</div>
		</div>
	);
}
