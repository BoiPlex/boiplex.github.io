"use client";

import { RiArrowRightLine, RiMenuLine } from "@remixicon/react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

const navLinks = [
	["Home", "/"],
	["Background", "/background"],
	["Projects", "/projects"],
	["Contact", "/contact"],
];

export default function HeaderBlockOld() {
	const path = usePathname();

	return (
		<header className="flex h-16 w-full justify-start md:justify-center items-center gap-6 border-b border-border px-4 text-foreground sm:px-6">
			<nav className="flex gap-9 hidden md:flex">
				{navLinks.map(([name, link]) => (
					<a
						key={name}
						href={link}
						className={"text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-2 py-1 rounded-sm " + (path === link ? "bg-muted" : "")}
					>
						{name}
					</a>
				))}
			</nav>
			<div className="absolute right-4">
				<ThemeToggle />
			</div>
			<div className="flex items-center gap-2">
				<Sheet>
					<SheetTrigger asChild aria-label="Open menu">
						<Button
							variant="outline"
							size="icon"
							className="md:hidden"
						>
							<RiMenuLine aria-hidden="true" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full sm:max-w-xs">
						<SheetHeader>
							<SheetTitle className="flex items-center gap-2">
								<div
									className="grid grid-cols-2 gap-0.5"
									aria-hidden="true"
								>
									<div className="size-2 bg-primary" />
									<div className="size-2 bg-primary" />
									<div className="size-2 bg-primary" />
									<div className="size-2 bg-primary" />
								</div>
								Site
							</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col px-2">
							{navLinks.map(([name, link]) => (
								<SheetClose
									asChild
									key={name}
									className="px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<a href={link}>{name}</a>
								</SheetClose>
							))}
						</nav>
						<div className="mt-auto p-4">
							<Button asChild className="w-full">
								<a href="#">
									Get Started
									<RiArrowRightLine
										data-icon="inline-end"
										aria-hidden="true"
									/>
								</a>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
