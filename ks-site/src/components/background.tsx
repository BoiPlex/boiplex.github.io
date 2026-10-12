"use client";

import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import { useTheme } from "@teispace/next-themes";

export default function Background() {
	const { theme } = useTheme();

	return (
		<div className="absolute -z-1 w-full inset-0 overflow-hidden bg-[radial-gradient(circle,#7d99ff_0%,#b7c7ff_50%,#ffffff_100%)] dark:bg-[radial-gradient(circle,#170062_0%,#090025_50%,#000000_100%)]">
			<div className="">
				<Floating3DParticles
					size={1}
					depth={0.3}
					drift={0.5}
					opacity={0.5}
					quantity={200}
					color={theme === "dark" ? "#8B5CF6" : "#200070"}
				/>
			</div>
		</div>
	);
}
