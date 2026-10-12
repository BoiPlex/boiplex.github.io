import { LuSearchX } from "react-icons/lu";


export default function NotFound() {
	return (
		<div className="flex justify-center mt-24">
            <div className="flex flex-col items-center gap-4">
                <LuSearchX size={128} />
				<h1 className="text-3xl">404 | Page Not Found...</h1>
			</div>
		</div>
	);
}
