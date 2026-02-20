import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, refreshCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    shippingAddress: '',
    paymentMethod: 'COD'
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/orders/create', orderDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Order placed successfully!');
      await refreshCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {!checkout ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img
                  src={item.product.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600">{item.product.brand}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>₹{cart.totalAmount}</span>
              </div>
            </div>
            <button
              onClick={() => setCheckout(true)}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <form onSubmit={handleCheckout}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Shipping Address</label>
              <textarea
                required
                className="input-field"
                rows="3"
                value={orderDetails.shippingAddress}
                onChange={(e) => setOrderDetails({
                  ...orderDetails,
                  shippingAddress: e.target.value
                })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Payment Method</label>
              <select
                className="input-field"
                value={orderDetails.paymentMethod}
                onChange={(e) => setOrderDetails({
                  ...orderDetails,
                  paymentMethod: e.target.value
                })}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCheckout(false)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cart;
