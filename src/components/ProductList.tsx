import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { Card, Col, Row, Spin, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <p>{error}</p>;

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="center">
        <Col span={22}>
          <h2 style={{ textAlign: 'center' }}>Product List</h2>
          <Row gutter={[16, 16]} justify="center">
            {products.map((product) => (
              <Col key={product.id} span={6}>
                <Card
                  hoverable
                  style={{ width: 200 }}
                  cover={<img alt={product.title} src={product.image} style={{ height: 150, objectFit: 'contain' }} />}
                >
                  <Card.Meta title={product.title} description={`$${product.price}`} />
                  <button
                     type="button"
                     onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                     className="btn btn-success"
                     style={{ width: '100%', marginTop: '10px' }}
                  >
                    Add to Cart
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#dc3545',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        <Badge count={cartItemCount} style={{ backgroundColor: '#fff', color: '#000' }}>
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
        </Badge>
      </div>
    </div>
  );
};

export default ProductList;
