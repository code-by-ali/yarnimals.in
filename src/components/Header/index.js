import React from "react";
import { ReactComponent as Logo1 } from "../../logo1.svg";
import { ReactComponent as Logo2 } from "../../logo-2.svg";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
	return (
		<header className="sticky top-0 bg-white flex items-center justify-between px-3 py-2.5 border-b border-[#ddd]">
			<div className="flex items-center justify-between gap-2">
				<Logo1 className="h-8 w-auto" />
				{/* <Logo2 className="h-8 w-44" /> */}
			</div>
			<span className="text-blue1 font-bold text-lg">YARNIMALS.IN</span>
			<button className="flex items-center text-[21px] justify-center bg-blue1 text-white border-none h-9 w-9 rounded-lg">
				<UserOutlined />
			</button>
		</header>
	);
};

export default Header;
