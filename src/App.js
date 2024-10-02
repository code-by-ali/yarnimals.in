import "./App.css";
import Header from "./components/Header";
import ProductList from "./components/ProductList";

function App() {
	return (
		<div className="flex flex-col">
			<Header />
			<ProductList />
		</div>
	);
}

export default App;
