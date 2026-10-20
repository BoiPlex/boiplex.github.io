"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { assetPath } from "@/lib/paths";
import { motion } from "motion/react";

const INTROS = ["(Full Stack Software Engineer)"];
const MESSAGES = ["Have a look around"];

const intro = INTROS[Math.floor(Math.random() * INTROS.length)];
const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

export default function Hero() {
	return (
		<div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
			<div className="flex w-full justify-center">
				<div className="flex w-fit max-w-full flex-col gap-6">
					<div className="flex min-h-20 flex-col-reverse items-start justify-center gap-10 sm:h-[15vh] sm:flex-row sm:items-center sm:gap-6">
						<h1 className="whitespace-nowrap text-3xl min-[380px]:text-4xl sm:text-6xl">
							<TypeAnimation
								sequence={["", 1200, "Hi, I'm Karim"]}
								speed={10}
								cursor={false}
								preRenderFirstString
								className="pre-line inline-block bg-[linear-gradient(135deg,#ff007f_0%,#7f00ff_50%,#00f0ff_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
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
								duration: 3,
								times: [0, 0.2, 1],
								ease: "easeInOut",
							}}
							className="shrink-0 relative"
						>
							<motion.div
								initial={{ opacity: 0, scale: 0, x: 200 }}
								animate={{ opacity: 1, scale: 1, rotate: -20, x: 0 }}
								transition={{ duration: 0.5, delay: 2.5 }}
								className="absolute whitespace-nowrap left-0 -bottom-1 text-yellow-300 text-xs sm:text-base"
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{duration: 1.5, repeat: Infinity, ease: "linear"}}
								>
									{"A Full Stack Software Engineer!"}
								</motion.div>								
							</motion.div>
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
						transition={{ delay: 2.5 }}
						className="min-h-8 text-2xl sm:h-[5vh] sm:text-4xl"
					>
						<TypeAnimation
							sequence={["", 3000, msg]}
							deletionSpeed={40}
							cursor
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
