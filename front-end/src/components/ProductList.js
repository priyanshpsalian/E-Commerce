import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/products");
    result = await result.json();
    setProducts(result);
  };
  console.log(products, "ll");
  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
    });
    result = await result.json();
    if (result) {
      getProducts();
    }
  };
  const handleSearch = async (e) => {
    let key = e.target.value;
    // console.log(key);
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };
  return (
    <div className="product-list">
      <input
        onChange={handleSearch}
        className="search-product-box"
        type="text"
        placeholder="Search Product"
      />
      <h1>product list</h1>
      <ul>
        <li>s.no</li>
        <li>name</li>
        <li>price</li>
        <li>caategory</li>
        <li>company</li>
        <li>operation</li>
      </ul>
      {products.length > 0 ? (
        products.map((item, index) => (
          <ul>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>{item.company}</li>
            <li>
              <button onClick={() => deleteProduct(item._id)}>delete</button>

              <Link to={`/update/${item._id}`}>Update</Link>
            </li>
          </ul>
        ))
      ) : (
        <h1>No Products found</h1>
      )}
    </div>
  );
};
export default ProductList;
