import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const onFinish = async (values) => {
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, values.email, values.password);
			message.success("Login successful!");
			navigate("/admin/home");
		} catch (error) {
			message.error("Login failed: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{ height: "calc(100vh - 57px)" }}
			className="flex justify-center sm:bg-gray-100"
		>
			<div className="w-full max-w-md h-max p-5 mt-10 bg-white rounded-lg sm:shadow-md">
				<h1 className="text-2xl font-bold text-center mb-6">Login</h1>
				<Form
					name="login"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Please input your Email!" },
							{ type: "email", message: "Please enter a valid email!" },
						]}
					>
						<Input prefix={<UserOutlined />} placeholder="Email" />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: "Please input your Password!" }]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							className="w-full bg-blue1 font-semibold text-base text-white"
						>
							Log in
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Login;
