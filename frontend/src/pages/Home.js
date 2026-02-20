import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Fridge', icon: '🧊', color: 'bg-blue-100' },
  { name: 'Watch', icon: '⌚', color: 'bg-green-100' },
  { name: 'Phone', icon: '📱', color: 'bg-purple-100' },
  { name: 'Laptops', icon: '💻', color: 'bg-yellow-100' },
  { name: 'Clothes', icon: '👕', color: 'bg-pink-100' },
  { name: 'Tshirts', icon: '👕', color: 'bg-indigo-100' },
  { name: 'Fan', icon: '🌀', color: 'bg-cyan-100' },
  { name: 'Cooler', icon: '❄️', color: 'bg-blue-100' },
  { name: 'TV', icon: '📺', color: 'bg-red-100' },
  { name: 'AC', icon: '❄️', color: 'bg-teal-100' },
  { name: 'Bike', icon: '🏍️', color: 'bg-orange-100' },
  { name: 'Car', icon: '🚗', color: 'bg-gray-100' },
  { name: 'Cycles', icon: '🚲', color: 'bg-emerald-100' }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      // Get random 8 products for featured section
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Flipkart Clone
        </h1>
        <p className="text-xl mb-8">
          Shop the best products at amazing prices
        </p>
        <Link
          to="/products"
          className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
        >
          Start Shopping
        </Link>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products/category/${category.name}`}
              className={`${category.color} p-6 rounded-lg text-center hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
