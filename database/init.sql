-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    INDEX idx_category (category),
    INDEX idx_price (price),
    FULLTEXT INDEX idx_search (name, description)
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    INDEX idx_cart_id (cart_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_date (order_date),
    INDEX idx_status (status)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@example.com', '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.', 'Admin User', 'ADMIN');

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category, brand, image_url) VALUES
-- Fridge
('Samsung Double Door Fridge', 'Samsung 253L 3 Star Inverter Frost Free Double Door Refrigerator', 28990, 15, 'Fridge', 'Samsung', 'https://via.placeholder.com/300x200?text=Samsung+Fridge'),
('LG Single Door Fridge', 'LG 190 L 4 Star Direct Cool Single Door Refrigerator', 15990, 20, 'Fridge', 'LG', 'https://via.placeholder.com/300x200?text=LG+Fridge'),
-- Watch
('Fastrack Analog Watch', 'Fastrack Analog Black Dial Men''s Watch', 1995, 50, 'Watch', 'Fastrack', 'https://via.placeholder.com/300x200?text=Fastrack+Watch'),
('Titan Smart Watch', 'Titan Smart Pro with Bluetooth Calling', 8995, 30, 'Watch', 'Titan', 'https://via.placeholder.com/300x200?text=Titan+Watch'),
-- Phone
('iPhone 15 Pro', 'Apple iPhone 15 Pro (256 GB) - Natural Titanium', 134900, 10, 'Phone', 'Apple', 'https://via.placeholder.com/300x200?text=iPhone+15+Pro'),
('Samsung Galaxy S23', 'Samsung Galaxy S23 Ultra 5G (12GB RAM, 512GB)', 112999, 12, 'Phone', 'Samsung', 'https://via.placeholder.com/300x200?text=Galaxy+S23'),
-- Laptops
('MacBook Pro 16', 'Apple MacBook Pro with M3 Pro Chip', 199900, 8, 'Laptops', 'Apple', 'https://via.placeholder.com/300x200?text=MacBook+Pro'),
('Dell XPS 15', 'Dell XPS 15 Intel Core i7 13th Gen Laptop', 185990, 10, 'Laptops', 'Dell', 'https://via.placeholder.com/300x200?text=Dell+XPS'),
-- Clothes
('Men''s Cotton Shirt', 'US Polo Assn Men''s Cotton Casual Shirt', 1899, 100, 'Clothes', 'US Polo', 'https://via.placeholder.com/300x200?text=US+Polo+Shirt'),
('Women''s Kurta', 'Libas Women''s Cotton Printed Kurta', 1299, 80, 'Clothes', 'Libas', 'https://via.placeholder.com/300x200?text=Women+Kurta'),
-- Tshirts
('Polo T-Shirt', 'US Polo Assn Men''s Polo Collar T-Shirt', 999, 150, 'Tshirts', 'US Polo', 'https://via.placeholder.com/300x200?text=Polo+TShirt'),
('Round Neck T-Shirt', 'Nike Men''s Round Neck T-Shirt', 1499, 120, 'Tshirts', 'Nike', 'https://via.placeholder.com/300x200?text=Nike+TShirt'),
-- Fan
('Crompton Fan', 'Crompton 1200mm High Speed Ceiling Fan', 2450, 40, 'Fan', 'Crompton', 'https://via.placeholder.com/300x200?text=Crompton+Fan'),
('Havells Fan', 'Havells 1200mm Decorative Ceiling Fan', 3200, 35, 'Fan', 'Havells', 'https://via.placeholder.com/300x200?text=Havells+Fan'),
-- Cooler
('Symphony Cooler', 'Symphony 35L Personal Air Cooler', 6990, 25, 'Cooler', 'Symphony', 'https://via.placeholder.com/300x200?text=Symphony+Cooler'),
('Bajaj Cooler', 'Bajaj 50L Desert Air Cooler', 8990, 20, 'Cooler', 'Bajaj', 'https://via.placeholder.com/300x200?text=Bajaj+Cooler'),
-- TV
('Sony 4K TV', 'Sony Bravia 139 cm (55 inches) 4K Ultra HD Smart LED TV', 64990, 10, 'TV', 'Sony', 'https://via.placeholder.com/300x200?text=Sony+TV'),
('Samsung QLED', 'Samsung 138 cm (55 inches) QLED 4K Smart TV', 72990, 8, 'TV', 'Samsung', 'https://via.placeholder.com/300x200?text=Samsung+TV'),
-- AC
('LG 1.5 Ton AC', 'LG 1.5 Ton 5 Star Inverter Split AC', 48990, 15, 'AC', 'LG', 'https://via.placeholder.com/300x200?text=LG+AC'),
('Daikin AC', 'Daikin 1.5 Ton 3 Star Inverter Split AC', 42990, 12, 'AC', 'Daikin', 'https://via.placeholder.com/300x200?text=Daikin+AC'),
-- Bike
('Honda CB Shine', 'Honda CB Shine SP BS6 Bike', 79999, 5, 'Bike', 'Honda', 'https://via.placeholder.com/300x200?text=Honda+Bike'),
('Royal Enfield', 'Royal Enfield Classic 350 Bike', 193000, 3, 'Bike', 'Royal Enfield', 'https://via.placeholder.com/300x200?text=Royal+Enfield'),
-- Car
('Toyota Fortuner', 'Toyota Fortuner 4x2 MT Car', 3500000, 2, 'Car', 'Toyota', 'https://via.placeholder.com/300x200?text=Toyota+Fortuner'),
('Hyundai Creta', 'Hyundai Creta SX 1.4L Turbo Car', 1600000, 4, 'Car', 'Hyundai', 'https://via.placeholder.com/300x200?text=Hyundai+Creta'),
-- Cycles
('Hercules Cycle', 'Hercules 26T Steel Cycle for Men', 5499, 25, 'Cycles', 'Hercules', 'https://via.placeholder.com/300x200?text=Hercules+Cycle'),
('Atlas Cycle', 'Atlas Goldline 26T Single Speed Cycle', 4799, 30, 'Cycles', 'Atlas', 'https://via.placeholder.com/300x200?text=Atlas+Cycle');

-- Create triggers
DELIMITER //

CREATE TRIGGER update_product_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER update_cart_total
    AFTER INSERT ON cart_items
    FOR EACH ROW
BEGIN
    UPDATE carts 
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM cart_items
        WHERE cart_id = NEW.cart_id
    )
    WHERE id = NEW.cart_id;
END//

CREATE TRIGGER update_cart_total_on_delete
    AFTER DELETE ON cart_items
    FOR EACH ROW
BEGIN
    UPDATE carts 
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM cart_items
        WHERE cart_id = OLD.cart_id
    )
    WHERE id = OLD.cart_id;
END//

DELIMITER ;

-- Create stored procedures
DELIMITER //

CREATE PROCEDURE GetTopSellingProducts(IN limit_count INT)
BEGIN
    SELECT p.*, SUM(oi.quantity) as total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT limit_count;
END//

CREATE PROCEDURE GetCategorySales(IN category_name VARCHAR(50))
BEGIN
    SELECT DATE(o.order_date) as sale_date, 
           COUNT(DISTINCT o.id) as order_count,
           SUM(oi.quantity) as items_sold,
           SUM(oi.quantity * oi.price) as revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE p.category = category_name
    GROUP BY DATE(o.order_date)
    ORDER BY sale_date DESC;
END//

DELIMITER ;
