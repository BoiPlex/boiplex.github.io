"use client";

import DockGuideArrow from "@/components/dock-guide-arrow";
import ThemeToggle from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "@teispace/next-themes";
import {
	BriefcaseBusinessIcon,
	FolderCodeIcon,
	HouseIcon,
	MailIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const FOOTER_DATA = {
	navigation: [
		{
			href: "/",
			label: "Home",
			icon: <HouseIcon className="size-6" />,
		},
		{
			href: "/background",
			label: "Background",
			icon: <BriefcaseBusinessIcon className="size-6" />,
		},
		{
			href: "/projects",
			label: "Projects",
			icon: <FolderCodeIcon className="size-6" />,
		},
	],
	socials: [
		{
			email: "kkarimshami@gmail.com",
			label: "Copy Email",
			icon: <MailIcon className="size-6" />,
			external: false,
		},
		{
			href: "https://github.com/BoiPlex",
			label: "GitHub",
			icon: <FaGithub className="size-6" aria-hidden="true" />,
			external: true,
		},
		{
			href: "https://www.linkedin.com/in/karim-shami",
			label: "LinkedIn",
			icon: <FaLinkedin className="size-6" aria-hidden="true" />,
			external: true,
		},
	],
};

const footerDockItemClassName = cn(
	buttonVariants({ variant: "ghost", size: "icon" }),
	"relative size-full rounded-full p-2 [&_svg]:size-full",
);

const dockGuideByPathname: Record<
	string,
	{
		label: string;
		target: "experience" | "projects" | "socials";
	}
> = {
	"/": { label: "Explore my experience", target: "experience" },
	"/background": { label: "See my projects", target: "projects" },
	"/projects": { label: "Let's connect", target: "socials" },
};

export default function FooterDock() {
	const pathname = usePathname();
	const normalizedPathname =
		pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
	const dockGuide = dockGuideByPathname[normalizedPathname];
	const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
	const [emailTooltipOpen, setEmailTooltipOpen] = useState(false);
	const [themeTooltipOpen, setThemeTooltipOpen] = useState(false);
	const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	useEffect(() => {
		return () => {
			if (copyFeedbackTimeoutRef.current) {
				clearTimeout(copyFeedbackTimeoutRef.current);
			}
		};
	}, []);

	const copyEmail = async (email: string) => {
		try {
			await navigator.clipboard.writeText(email);
			setCopiedEmail(email);
			setEmailTooltipOpen(true);

			if (copyFeedbackTimeoutRef.current) {
				clearTimeout(copyFeedbackTimeoutRef.current);
			}

			copyFeedbackTimeoutRef.current = setTimeout(() => {
				setCopiedEmail(null);
				copyFeedbackTimeoutRef.current = null;
			}, 2000);
		} catch {
			setEmailTooltipOpen(false);
			setCopiedEmail(null);
		}
	};

	const { theme } = useTheme();

	return (
		<>
			{dockGuide && (
				<DockGuideArrow
					key={normalizedPathname}
					label={dockGuide.label}
					target={dockGuide.target}
				/>
			)}
			<Dock
				className="sticky bottom-2 z-1 mt-2 max-w-[calc(100vw-1rem)] gap-1 p-1 sm:gap-2 sm:p-2"
				iconSize={36}
				iconDistance={70}
				iconMagnification={50}
			>
				{FOOTER_DATA.navigation.map(({ href, label, icon }) => (
					<DockIcon key={label}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={href}
									className={footerDockItemClassName}
									aria-label={label}
								>
									{icon}
								</Link>
							</TooltipTrigger>
							<TooltipContent>{label}</TooltipContent>
						</Tooltip>
					</DockIcon>
				))}
	
				<Separator orientation="vertical" />
				{FOOTER_DATA.socials.map(
					({ email, href, label, icon, external }) => {
						const isCopied = Boolean(email && copiedEmail === email);
	
						return (
							<DockIcon key={label}>
								<Tooltip
									open={email ? emailTooltipOpen : undefined}
									onOpenChange={
										email ? setEmailTooltipOpen : undefined
									}
								>
									<TooltipTrigger asChild>
										{email ? (
											<Button
												type="button"
												variant="ghost"
												className={footerDockItemClassName}
												onClick={() => copyEmail(email)}
												aria-label={label}
											>
												{icon}
											</Button>
										) : (
											<Link
												href={href!}
												className={footerDockItemClassName}
												target={
													external ? "_blank" : undefined
												}
												rel={
													external
														? "noopener noreferrer"
														: undefined
												}
												aria-label={label}
											>
												{icon}
											</Link>
										)}
									</TooltipTrigger>
									<TooltipContent>
										{isCopied ? "Copied!" : label}
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						);
					},
				)}
				<Separator orientation="vertical" />
				<DockIcon>
					<Tooltip
						open={themeTooltipOpen}
						onOpenChange={setThemeTooltipOpen}
					>
						<TooltipTrigger asChild>
							<ThemeToggle
								variant="ghost"
								className={footerDockItemClassName}
								aria-label="Theme Toggle"
								onClick={() => setThemeTooltipOpen(true)}
							/>
						</TooltipTrigger>
						<TooltipContent>{theme === "dark" ? "Toggle to Ugly White" : "Toggle to Gigachad Dark"}</TooltipContent>
					</Tooltip>
				</DockIcon>
			</Dock>
		</>
	);
}
