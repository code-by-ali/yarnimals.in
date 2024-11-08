import { AppstoreFilled } from "@ant-design/icons";
import { Carousel, Spin } from "antd";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase"; // Ensure this path is correct for your project structure

const SingleProduct = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const docRef = doc(db, "products", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setProduct({ id: docSnap.id, ...docSnap.data() });
				} else {
					setError("Product not found");
				}
			} catch (err) {
				setError("Error fetching product: " + err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleWhatsAppShare = () => {
		if (!product) return;

		const phoneNumber = "+918962117752"; // Replace with the admin's phone number
		const message = `Hi, I'm interested in buying ${product.name}. Price: ₹${product.price}. Can you provide more details?`;
		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

		window.open(whatsappUrl, "_blank");
	};

	if (loading)
		return (
			<div className="w-full h-32 flex justify-center items-center">
				<Spin />
			</div>
		);
	if (error) return <div>Error: {error}</div>;
	if (!product) return <div>Product not found</div>;

	return (
		<div className="p-5 max-w-7xl mx-auto">
			<nav className="flex" aria-label="Breadcrumb">
				<ol className="inline-flex items-center space-x-1 md:space-x-2">
					<li className="inline-flex items-center">
						<a
							href="/"
							className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue1"
						>
							<AppstoreFilled className="w-3 h-3 me-2" />
							Products
						</a>
					</li>
					<li aria-current="page">
						<div className="flex items-center">
							<svg
								className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="m1 9 4-4-4-4"
								/>
							</svg>
							<span className="ms-1 text-sm capitalize font-medium text-gray-500 md:ms-2">
								{product.name}
							</span>
						</div>
					</li>
				</ol>
			</nav>

			<div className="mt-3 lg:flex lg:space-x-8">
				<div className="lg:w-1/2">
					<Carousel
						arrows={product.imagesUrl.length > 1}
						dots={true}
						infinite={true}
						draggable={true}
					>
						{product.imagesUrl.map((url, index) => (
							<div key={index}>
								<img
									className="object-cover w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px]"
									src={url}
									alt={``}
								/>
							</div>
						))}
					</Carousel>
				</div>

				<div className="mt-3 lg:mt-0 lg:w-1/2">
					<h1 className="text-lg sm:text-3xl lg:text-4xl text-black1 tracking-wide font-semibold">
						{product.name}
					</h1>
					<p className="mt-1 text-base sm:text-2xl lg:text-3xl text-black1 tracking-wide font-semibold">
						₹{product.price}
					</p>
					<div className="mt-4">
						<h2 className="text-[15px] sm:text-xl lg:text-2xl text-black tracking-wide font-semibold">
							Description
						</h2>
						<p className="text-[15px] sm:text-lg mt-0.5">
							{product.description}
						</p>
					</div>
					<button
						onClick={handleWhatsAppShare}
						className="w-full mt-8 rounded-lg py-2.5 px-6 uppercase bg-blue1 text-center font-semibold text-white text-base transition-colors duration-300 hover:bg-blue-700"
					>
						DM Yarnimals.in to buy
					</button>
				</div>
			</div>
		</div>
	);
};

export default SingleProduct;
