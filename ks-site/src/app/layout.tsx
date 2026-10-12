import "@/app/globals.css";

import { DM_Sans, Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import { ThemeProvider } from "@teispace/next-themes";
import { cn } from "@/lib/utils";
import Background from "@/components/background";
import FooterDock from "@/components/footer-dock";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Karim Shami's Site",
	description: "Personal website to showcase experience and projects.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full overflow-x-clip [scrollbar-gutter:stable]",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				dmSans.variable,
			)}
			suppressHydrationWarning
		>
			<body className="relative isolate flex min-h-dvh flex-col overflow-x-clip">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
				>
					<TooltipProvider>
						<Header/>
						<Background />
						<main className="flex min-w-0 flex-1 flex-col">{children}</main>
						<FooterDock />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
