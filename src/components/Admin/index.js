import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
	Button,
	Carousel,
	Form,
	Input,
	InputNumber,
	Modal,
	Spin,
	Upload,
	message,
} from "antd";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { db, storage } from "../../firebase";

const AdminDashboard = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState([]);

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

	const deleteImagesFromStorage = async (imageUrls) => {
		const deletePromises = imageUrls.map(async (url) => {
			const imageRef = ref(storage, url);
			try {
				await deleteObject(imageRef);
			} catch (error) {
				console.error("Error deleting image:", error);
			}
		});
		await Promise.all(deletePromises);
	};

	const handleDelete = async (id) => {
		try {
			const productToDelete = products.find((p) => p.id === id);
			if (productToDelete && productToDelete.imagesUrl) {
				await deleteImagesFromStorage(productToDelete.imagesUrl);
			}
			await deleteDoc(doc(db, "products", id));
			message.success("Product deleted successfully");
			fetchProducts();
		} catch (error) {
			message.error("Failed to delete product");
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		form.setFieldsValue(product);
		setFileList(
			product.imagesUrl.map((url, index) => ({
				uid: `-${index}`,
				name: `Image ${index + 1}`,
				status: "done",
				url: url,
			})),
		);
		setModalVisible(true);
	};

	const handleAdd = () => {
		setEditingProduct(null);
		form.resetFields();
		setFileList([]);
		setModalVisible(true);
	};

	const uploadImages = async (files) => {
		const uploadPromises = files.map((file) => {
			if (file.url) return file.url; // If the image already has a URL, it's an existing image
			const storageRef = ref(storage, `product-images/${v4()}_${file.name}`);
			return uploadBytes(storageRef, file.originFileObj).then((snapshot) =>
				getDownloadURL(snapshot.ref),
			);
		});
		return Promise.all(uploadPromises);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// Upload new images and get URLs
			const imageUrls = await uploadImages(fileList);

			const productData = {
				...values,
				imagesUrl: imageUrls,
			};

			if (editingProduct) {
				// Delete old images that are not in the new imageUrls
				const imagesToDelete = editingProduct.imagesUrl.filter(
					(url) => !imageUrls.includes(url),
				);
				await deleteImagesFromStorage(imagesToDelete);

				await updateDoc(doc(db, "products", editingProduct.id), productData);
				message.success("Product updated successfully");
			} else {
				await addDoc(collection(db, "products"), productData);
				message.success("Product added successfully");
			}

			setModalVisible(false);
			fetchProducts();
		} catch (error) {
			message.error("Operation failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<Button
				icon={<PlusOutlined />}
				onClick={handleAdd}
				style={{ marginBottom: 16 }}
			>
				Add Product
			</Button>

			{loading ? (
				<div className="w-full h-32 flex justify-center items-center">
					<Spin />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{products.map((item) => (
						<div
							key={item.id}
							className="flex flex-row items-start bg-white border border-[#ddd] rounded-lg h-[130px] drop-shadow"
						>
							<div className="max-w-[110px]">
								<Carousel
									arrows={item.imagesUrl.length > 1}
									dots={false}
									infinite={true}
									draggable={true}
								>
									{item.imagesUrl.map((url) => (
										<div>
											<img
												className="object-cover rounded-tl-lg rounded-bl-lg h-[128px] min-w-[110px]"
												src={url}
												alt=""
											/>
										</div>
									))}
								</Carousel>
							</div>
							<div className="flex flex-col gap-2 w-full py-1 px-2 h-full">
								<div className="flex justify-between items-start w-full gap-1">
									<span className="text-[15px] font-medium tracking-wide text-black truncate flex-1">
										{item?.name}
									</span>
									<p className="text-[15px] font-medium text-black1 whitespace-nowrap">
										₹{item?.price}
									</p>
								</div>
								<div className="flex items-start gap-2 flex-1">
									<div className="flex-1 overflow-hidden">
										<p className="text-sm line-clamp-4">{item?.description}</p>
									</div>
									<div className="flex flex-col gap-2 mt-1 h-full pb-1">
										<Button
											icon={<EditOutlined />}
											onClick={() => handleEdit(item)}
										/>
										<Button
											danger
											icon={<DeleteOutlined />}
											onClick={() => handleDelete(item.id)}
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<Modal
				title={editingProduct ? "Edit Product" : "Add Product"}
				visible={modalVisible}
				onOk={handleModalOk}
				onCancel={() => setModalVisible(false)}
				confirmLoading={loading}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Name" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="price" label="Price" rules={[{ required: true }]}>
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[{ required: true }]}
					>
						<Input.TextArea rows={5} />
					</Form.Item>
					<Form.Item label="Images" rules={[{ required: true }]}>
						<Upload
							listType="picture-card"
							fileList={fileList}
							onChange={({ fileList }) => setFileList(fileList)}
							beforeUpload={() => false} // Prevent auto upload
						>
							<div>
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</div>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AdminDashboard;
