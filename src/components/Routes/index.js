import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import AdminHome from "../Admin";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import Login from "../Login";
import ProductList from "../ProductList";
import Header from "./../Header/index";
import { PrivateRoute } from "./PrivateRoute";

function LoginRedirect() {
	const { user } = useAuth();
	return user ? <Navigate to="/admin/home" /> : <Login />;
}

function AppRoutes() {
	return (
		<AuthProvider>
			{/* <Layout> */}
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<ProductList />} />
					<Route path="/login" element={<LoginRedirect />} />
					<Route element={<PrivateRoute />}>
						<Route path="/admin/home" element={<AdminHome />} />
						{/* Add more admin routes here */}
					</Route>
					<Route path="*" element={<Navigate to="/login" />} />
				</Routes>
			</Router>
			{/* </Layout> */}
		</AuthProvider>
	);
}

export default AppRoutes;
