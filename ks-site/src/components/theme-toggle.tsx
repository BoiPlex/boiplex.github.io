"use client";

import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useTheme } from "@teispace/next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

type ThemeToggleProps = Omit<
	React.ComponentProps<typeof Button>,
	"children"
> & {
	quickToggle?: boolean;
};

export default function ThemeToggle({
	quickToggle = true,
	variant = "outline",
	size = "icon",
	onClick,
	...buttonProps
}: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();

	const icons = (
		<>
			<SunIcon className="size-6 scale-100 rotate-0 transition-transform duration-300 ease-in-out dark:scale-0 dark:-rotate-90" />
			<MoonIcon className="absolute !size-[70%] scale-0 rotate-90 transition-transform duration-300 ease-in-out dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</>
	);

	if (quickToggle) {
		return (
			<Button
				{...buttonProps}
				variant={variant}
				size={size}
				onClick={(event) => {
					onClick?.(event);
					if (!event.defaultPrevented) {
						setTheme(theme === "dark" ? "light" : "dark");
					}
				}}
			>
				{icons}
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					{...buttonProps}
					variant={variant}
					size={size}
					onClick={onClick}
				>
					{icons}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}