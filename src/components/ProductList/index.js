import React from "react";
import Pic1 from "../../assets/images/pic1.jpeg";
import Pic2 from "../../assets/images/pic2.jpeg";

const ProductList = () => {
	const getImageURL = (idx) => {
		return idx % 2 === 0 ? Pic1 : Pic2;
	};

	return (
		<div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 w-full">
			{new Array(10).fill(1).map((_, idx) => (
				<div className="border p-3 flex flex-col font-medium rounded-lg border-[#ddd]">
					<img
						src={getImageURL(idx)}
						className="w-full object-contain rounded-lg"
						alt="product"
					/>
					<span className="text-[15px] mt-1 mb-0.5 text-black">
						Sunflower Pot
					</span>
					<span className="text-[14px] text-black1">₹499</span>
				</div>
			))}
		</div>
	);
};

export default ProductList;
