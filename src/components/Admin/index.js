import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Upload,
	message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
} from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { v4 } from "uuid";

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
			console.error("Operation failed:", error);
			message.error("Operation failed");
		} finally {
			setLoading(false);
		}
	};

	const columns = [
		{ title: "Name", dataIndex: "name", key: "name" },
		{ title: "Price", dataIndex: "price", key: "price" },
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			ellipsis: true,
		},
		{
			title: "Images",
			dataIndex: "imagesUrl",
			key: "imagesUrl",
			render: (imagesUrl) =>
				imagesUrl && imagesUrl.length > 0 ? (
					<img
						src={imagesUrl[0]}
						alt="product"
						style={{ width: 50, height: 50 }}
					/>
				) : (
					"No image"
				),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Button
						icon={<DeleteOutlined />}
						onClick={() => handleDelete(record.id)}
						style={{ marginLeft: 8 }}
					/>
				</>
			),
		},
	];

	return (
		<div className="p-5">
			<Button
				icon={<PlusOutlined />}
				onClick={handleAdd}
				style={{ marginBottom: 16 }}
			>
				Add Product
			</Button>
			<Table
				columns={columns}
				dataSource={products}
				loading={loading}
				rowKey="id"
			/>
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
						<Input.TextArea />
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
