import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const categories = [
  'Fridge', 'Watch', 'Phone', 'Laptops', 'Clothes', 
  'Tshirts', 'Fan', 'Cooler', 'TV', 'AC', 'Bike', 'Car', 'Cycles'
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Flipkart Clone
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-yellow-400 rounded-r-lg hover:bg-yellow-500"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <UserIcon className="h-6 w-6" />
                    <span>{user?.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">Login</Link>
                <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex space-x-6 py-3 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products/category/${category}`}
              className="hover:text-gray-200 whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900"
              />
              <button
                type="submit"
                className="px-4 bg-yellow-400 rounded-r-lg"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-900" />
              </button>
            </form>

            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products/category/${category}`}
                  className="block py-2 hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="border-t border-blue-500 pt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="block py-2">Cart ({cartItemCount})</Link>
                  <Link to="/orders" className="block py-2">My Orders</Link>
                  {isAdmin && <Link to="/admin" className="block py-2">Admin Dashboard</Link>}
                  <button onClick={logout} className="block w-full text-left py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2">Login</Link>
                  <Link to="/register" className="block py-2">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
