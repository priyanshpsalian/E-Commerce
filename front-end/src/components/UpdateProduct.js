import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const UpdateProduct = () => {
  const [pname, setName] = useState({
    name: "",
    price: "",
    category: "",
    company: "",
  });
  const params = useParams();
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let result = await fetch(`http://localhost:5000/product/${params.id}`);
    result = await result.json();
    console.log(result);
    setName({
      name: result.name,
      price: result.price,
      category: result.category,
      company: result.company,
    });
  };
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setName({
      ...pname,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const update = async () => {
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      method: "Put",
      body: JSON.stringify({
        name: pname.name,
        category: pname.category,
        company: pname.company,

        price: pname.price,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    result = await result.json();
    console.log(result);
    navigate("/");
  };
  return (
    <div className="register">
      <h1>Update Product</h1>
      <input
        className="inputBox"
        type="text"
        name="name"
        value={pname.name}
        placeholder="Enter your name"
        onChange={handleChange}
      ></input>
      {error && !pname.name && (
        <span className="invalid">Enter valid name</span>
      )}
      <input
        className="inputBox"
        type="price"
        name="price"
        value={pname.price}
        placeholder="Enter price"
        onChange={handleChange}
      ></input>
      {error && !pname.price && (
        <span className="invalid">Enter valid price</span>
      )}
      <input
        className="inputBox"
        type="category"
        name="category"
        value={pname.category}
        placeholder="Enter category"
        onChange={handleChange}
      ></input>
      {error && !pname.category && (
        <span className="invalid">Enter valid category</span>
      )}
      <input
        className="inputBox"
        type="company"
        name="company"
        value={pname.company}
        placeholder="Enter company"
        onChange={handleChange}
      ></input>
      {error && !pname.company && (
        <span className="invalid">Enter valid company</span>
      )}
      <button className="appButton" onClick={update} type="button">
        Login
      </button>
    </div>
  );
};
export default UpdateProduct;
