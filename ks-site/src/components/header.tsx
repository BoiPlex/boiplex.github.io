import { GlyphMatrix } from "@/components/ui/glyph-matrix";

export default function Header() {
	// [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]
	return (
		<div>
			<div className="absolute h-[180px] w-full bg-[linear-gradient(180deg,#f700ff79_0%,#f700ff12_5%)] [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]">
				<GlyphMatrix
					glyphs="67"
					cellSize={20}
					mutationRate={0.1}
					interval={90}
					fadeBottom={1}
					color="#f700ff"
				/>
			</div>
			<div className="h-24" />
		</div>
	);
}
