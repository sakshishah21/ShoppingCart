import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { Button, Table } from "antd";
import { ColumnType } from "antd/es/table";

interface CartItem {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: number, change: number) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }
    }
  };

  const columns: ColumnType<CartItem>[] = [
    {
      title: "Product",
      dataIndex: "image",
      key: "image",
      render: (text: string, record: CartItem) => (
        <img
          src={record.image}
          alt={record.title}
          width={50}
          className="img-fluid"
        />
      ),
      align: "center"
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: number) => `$${text}`,
      align: "center"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: number, record: CartItem) => (
        <div className="d-flex justify-content-center align-items-center">
          <Button
            onClick={() => handleQuantityChange(record.id, -1)}
            size="small"
            style={{
              marginRight: "5px",
              backgroundColor: "#f8d7da",
              borderColor: "#f5c6cb"
            }}
          >
            -
          </Button>
          <span className="mx-2">{record.quantity}</span>
          <Button
            onClick={() => handleQuantityChange(record.id, 1)}
            size="small"
            style={{
              marginLeft: "5px",
              backgroundColor: "#d4edda",
              borderColor: "#c3e6cb"
            }}
          >
            +
          </Button>
        </div>
      ),
      align: "center"
    },
    {
      title: "Action",
      key: "remove",
      render: (text: string, record: CartItem) => (
        <Button
          onClick={() => dispatch(removeFromCart(record.id))}
          type="primary"
          size="small"
          style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
        >
          Remove
        </Button>
      ),
      align: "center"
    }
  ];

  const dataSource: CartItem[] = cart.map((item) => ({
    id: item.id,
    image: item.image,
    title: item.title,
    price: item.price,
    quantity: item.quantity
  }));

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Shopping Cart</h2>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        className="table-responsive"
      />
      <h3 className="text-center mt-3">Total: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default Cart;
