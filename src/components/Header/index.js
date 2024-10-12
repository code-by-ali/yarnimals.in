import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReactComponent as Logo1 } from "../../logo1.svg";

const Header = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/");
		} catch (error) {
			message.error(error);
		}
	};

	return (
		<header className="sticky z-[999] top-0 bg-white flex items-center justify-between px-3 py-2.5 border-b border-[#ddd]">
			<div className="flex items-center justify-between gap-2 cursor-pointer">
				<Logo1 className="h-8 w-auto" onClick={() => navigate("/")} />
			</div>
			<span
				className="text-blue1 font-bold text-lg cursor-pointer"
				onClick={() => navigate("/")}
			>
				YARNIMALS.IN
			</span>
			{user ? (
				<div className="flex gap-1">
					<Button
						type="primary"
						icon={<HomeOutlined />}
						onClick={() => navigate("/admin/home")}
						className="bg-blue1 font-semibold text-white"
					/>
					<Button
						type="primary"
						icon={<LogoutOutlined />}
						onClick={handleLogout}
						className="bg-blue1 font-semibold text-white"
					/>
				</div>
			) : (
				<button
					className="flex items-center text-[21px] justify-center bg-blue1 text-white border-none h-9 w-9 rounded-lg"
					onClick={() => navigate("/login")}
				>
					<UserOutlined />
				</button>
			)}
		</header>
	);
};

export default Header;
