import { message, Spin } from "antd";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const querySnapshot = await getDocs(collection(db, "products"));
			const productsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setProducts(productsData);
		} catch (error) {
			message.error("Failed to fetch products");
		}
		setLoading(false);
	};

	return (
		<>
			{loading ? (
				<div className="w-full h-32 flex justify-center items-center">
					<Spin />
				</div>
			) : (
				<div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 w-full">
					{products.map((item) => (
						<div
							className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow cursor-pointer"
							onClick={() => navigate(`/product/${item.id}`)}
						>
							<div className="p-2">
								<img
									className="rounded-t-md h-48 w-full object-cover"
									src={item?.imagesUrl[0]}
									alt=""
								/>
							</div>
							<div className="px-2 pb-2">
								<span>
									<h5 className="text-sm mb-1 font-medium tracking-wide text-black1">
										{item?.name}
									</h5>
								</span>
								<div className="flex items-center justify-between">
									<span className="text-[13px] font-medium text-black1">
										₹{item?.price}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default ProductList;
