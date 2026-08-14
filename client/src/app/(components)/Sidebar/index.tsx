"use client";
import { Menu } from "lucide-react";

const Sidebar = () => {
	return (
		<div>
			{/* TOP LOGO */}
			<div className="felx gap-3 justify-between md:justify-normal items-center pt-8">
				<div>Logo</div>
				<h1 className="font-extrabold text-2xl">Invenovan</h1>
				<button
					className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
					onClick={() => {}}
				>
					<Menu className="w-4 h-4" />
				</button>
			</div>

			{/* LINKS */}
			<div className="grow mt-8">{/* links here */}</div>

			{/* FOOTER */}
			<div>
				<p className="text-center text-xs text-gray-500">
					&copy; 2026 Invenovan
				</p>
			</div>
		</div>
	);
};

export default Sidebar;
