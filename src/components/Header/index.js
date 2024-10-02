import React from "react";
import { ReactComponent as Logo1 } from "../../logo1.svg";
import { ReactComponent as Logo2 } from "../../logo-2.svg";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
	return (
		<header className="flex items-center justify-between px-3 py-3 border-b border-[#ddd]">
			<div className="flex items-center gap-2">
				<Logo1 className="h-8 w-auto" />
				<Logo2 className="h-8 w-44" />
			</div>
			<button className="flex items-center text-[21px] justify-center bg-blue1 text-white border-none h-9 w-9 rounded-lg">
				<UserOutlined />
			</button>
		</header>
	);
};

export default Header;
