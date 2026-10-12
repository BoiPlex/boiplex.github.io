import BadgeDivider from "@/components/badge-divider";
import ProjectCard from "@/components/project-card";
import { Project } from "@/lib/types";
import { FileTextIcon, PanelsTopLeftIcon, PlayIcon } from "lucide-react";
import * as motion from "motion/react-client";

const projects: Project[] = [
	// Web Development
	{
		name: "AislePal",
		description:
			"Developed and launched an AI-powered retail shopping platform featuring barcode scanning, personalized recommendations, checkout, real-time inventory synchronization, and store analytics. Built authentication, payment processing, role-based access control, and recommendation systems using matrix factorization.",
		date: "Nov 2025 - Jul 2026",
		video: "",
		image: "/images/aislepal.png",
		links: {
			Website: {
				href: "https://app.aislepal.co",
				tooltip: "Visit AislePal (prototype, meant as a web app)",
			},
			"Landing Page": {
				href: "https://aislepal.co",
				tooltip: "View landing page",
				icon: <PanelsTopLeftIcon size={20} />,
			},
			GitHub: {
				href: "https://github.com/AislePal/aislepal.github.io",
				tooltip: "View landing page source code",
			},
		},
		skills: [
			"React",
			"TypeScript",
			"Tailwind",
			"Next.js",
			"PostgreSQL",
			"Drizzle",
		],
		tags: ["frontend", "backend", "ai", "ml"],
	},

	// Backend / Database
	{
		name: "L-Store Database System",
		description:
			"Built a lineage-based columnar database management system from scratch in Python, featuring multi-version concurrency control, transaction rollback, primary-key indexing, and base/tail page architecture. Implemented an LRU buffer pool, disk persistence, and asynchronous merge operations without external database libraries.",
		date: "Jan 2025 - Mar 2025",
		video: "",
		image: "/images/lstore.png",
		links: {
			GitHub: {
				href: "https://github.com/BoiPlex/ECS-165A-Database-System",
			},
		},
		skills: ["Python"],
		tags: ["backend"],
	},

	// Machine Learning
	{
		name: "Hand-Computer Control Interface",
		description:
			"Developed a computer vision interface that translates hand gestures into mouse controls with 95% accuracy. Supports web browsing, drawing, playing chess, and controlling games like Minecraft using real-time hand tracking.",
		date: "2025",
		video: "",
		image: "/images/hand-computer-interface.png",
		links: {
			Demo: {
				href: "https://www.youtube.com/watch?v=sKuA4ksM-fo",
				tooltip: "Presentation + Demo",
			},
			Report: {
				href: "/files/hand-computer-interface-report.pdf",
				icon: <FileTextIcon size={20} />,
			},
			GitHub: {
				href: "https://github.com/nathancbao/Hand-Computer-Control-Interface",
			},
		},
		skills: ["Python", "OpenCV", "MediaPipe", "PyTorch"],
		tags: ["ml"],
	},
	{
		name: "Image Colorization ML Model",
		description:
			"Designed and trained a convolutional neural network to colorize grayscale images, achieving a 26% improvement over the baseline model. Built a Flask-based web interface for interacting with the model.",
		date: "2025",
		video: "",
		image: "/images/colorizer.png",
		links: {
			Report: {
				href: "/files/colorizer-report.pdf",
				icon: <FileTextIcon size={20} />,
			},
			GitHub: {
				href: "https://github.com/BoiPlex/ECS171_ML_Image_Colorization",
			},
		},
		skills: ["Python", "Flask", "PyTorch", "HTML", "CSS", "JavaScript"],
		tags: ["ml", "backend", "frontend"],
	},
	{
		name: "Dog Breed Classification",
		description:
			"Developed a CNN-based dog breed classifier achieving 90% accuracy across 120 breeds using a dataset of over 20,000 images. Built an interactive Streamlit application for image classification.",
		date: "2024",
		video: "",
		image: "/images/dog-breed.png",
		links: {
			GitHub: {
				href: "https://github.com/BoiPlex/Dog-Breed-Classification",
			},
		},
		skills: ["Python", "Streamlit", "TensorFlow"],
		tags: ["ml", "frontend"],
	},
	{
		name: "MoodMonitor",
		description:
			"Created a real-time facial emotion recognition application during HackDavis 2024. Developed a cross-platform Flutter interface connected to a Python FastAPI backend for processing facial expressions.",
		date: "Apr 2024",
		video: "",
		image: "/images/emotion-scan.png",
		links: {
			Devpost: {
				href: "https://devpost.com/software/healthscan-kolbqj",
			},
			GitHub: { href: "https://github.com/BoiPlex/HealthScan" },
		},
		skills: ["Flutter", "Dart", "Python", "FastAPI"],
		tags: ["ml", "frontend", "backend"],
	},
	{
		name: "PalmReader",
		description:
			"Built a real-time American Sign Language recognition application during HackDavis 2025, translating over 30 ASL letters and common gestures using computer vision and machine learning.",
		date: "Apr 2025",
		video: "",
		image: "/images/asl.png",
		links: {
			Demo: { href: "https://player.vimeo.com/video/1077087825" },
			Devpost: {
				href: "https://devpost.com/software/asl-to-text-translation-app",
			},
			GitHub: { href: "https://github.com/BoiPlex/ASL-to-Text" },
		},
		skills: [
			"Python",
			"MediaPipe",
			"TensorFlow",
			"JavaScript",
			"TypeScript",
			"React",
			"Node.js",
		],
		tags: ["ml", "frontend"],
	},

	// LLM / AI Applications
	{
		name: "FlowState",
		description:
			"Developed an AI-powered focus companion during HackDavis 2026 that tracks browser activity, identifies distraction patterns, and displays productivity insights. Built as a browser extension with a React frontend, FastAPI backend, Gemini integration, and MongoDB.",
		date: "May 2026",
		video: "",
		image: "/images/flowstate.png",
		links: {
			Demo: { href: "https://www.youtube.com/watch?v=NDM8bHdoqHg" },
			Devpost: { href: "https://devpost.com/software/focusbuddy-hatsue" },
			GitHub: { href: "https://github.com/BoiPlex/FlowState" },
		},
		skills: [
			"React",
			"Plasmo",
			"JavaScript",
			"CSS",
			"Tailwind",
			"Python",
			"FastAPI",
			"Gemini",
			"MongoDB",
		],
		tags: ["frontend", "backend", "llm"],
	},

	// Embedded / IoT
	{
		name: "StepWise",
		description:
			"Engineered a portable IoT pedometer for real-time step tracking and GPS route mapping using accelerometer data. Integrated a CC3200 microcontroller with AWS IoT Core and Lambda for remote monitoring, an OLED display, and Google Maps visualization. Implemented I2C, UART, GPIO, SPI, and HTTP communication.",
		date: "Apr 2025 - Jun 2025",
		video: "",
		image: "/images/stepwise.png",
		links: {
			Demo: {
				href: "https://sites.google.com/view/stepwiseproject/video-demo",
			},
			"Project Website": {
				href: "https://sites.google.com/view/stepwiseproject?usp=sharing",
				tooltip: "Google Site going over design + demo",
			},
		},
		skills: [
			"C",
			"CC3200",
			"AWS IoT Core",
			"AWS Lambda",
			"Google Maps",
			"GPS",
			"I2C",
			"UART",
			"GPIO",
			"SPI",
			"HTTP",
		],
		tags: ["embedded", "backend"],
	},

	// Game Development
	{
		name: "Space Chase",
		description:
			"Led a four-person team to develop and publish a two-player platformer in Godot. Showcased the game to over 200 students and faculty, receiving positive feedback from judges and an invitation to an end-of-year exhibition.",
		date: "Oct 2024 - Dec 2024",
		video: "",
		image: "/images/space-chase.png",
		links: {
			Demo: {
				href: "https://www.youtube.com/watch?v=sAVLEPqOCx0",
				tooltip: "Watch the game trailer",
			},
			Game: {
				href: "https://endplex.itch.io/space-chase",
				icon: <PlayIcon size={20} />,
				tooltip: "Play the game on web (may stutter)",
			},
			GitHub: {
				href: "https://github.com/ECS-179-Game-Project/Space-Chase-Game",
			},
		},
		skills: ["Godot", "GDScript"],
		tags: ["game-dev"],
	},
	{
		name: "Orbitron",
		description:
			"Created a top-down tower defense clicker game featuring gravity-based mechanics and an orbital system during a game jam. Developed the gameplay and interactive systems using Godot and GDScript.",
		date: "Jul 2025",
		video: "",
		image: "/images/orbitron.png",
		links: {
			Game: {
				href: "https://khromeengine.itch.io/orbitron",
				icon: <PlayIcon size={20} />,
				tooltip: "Play the game",
			},
			GitHub: {
				href: "https://github.com/BoiPlex/Orbitron",
				tooltip: "This repo is kinda blank",
			},
		},
		skills: ["Godot", "GDScript"],
		tags: ["game-dev"],
	},
];

export default function ProjectsPage() {
	return (
		<div className="flex flex-col mt-4">
			<BadgeDivider title="Projects" />
			<div className="self-center grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4">
				{(projects as Project[]).map((project, idx) => (
					<motion.div
						initial={{ opacity: 0, y: 250, rotate: -10 }}
						whileInView={{ opacity: 1, y: 0, rotate: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						key={project.name}
					>
						<ProjectCard project={project} />
					</motion.div>
				))}
			</div>
		</div>
	);
}
