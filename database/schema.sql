-- Database Schema for Sport Reservation System
CREATE DATABASE IF NOT EXISTS sport_reservation;
USE sport_reservation;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sports fields table
CREATE TABLE fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    facilities JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Field schedules table
CREATE TABLE field_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    field_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    field_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO fields (name, description, location, price_per_hour, image_url, facilities) VALUES
('Lapangan Futsal A', 'Lapangan futsal indoor dengan rumput sintetis berkualitas tinggi', 'Jl. Merdeka No. 123, Ciledug', 150000, '/images/futsal-a.jpg', '["AC", "Locker Room", "Parking", "Cafe"]'),
('Lapangan Futsal B', 'Lapangan futsal outdoor dengan pencahayaan LED', 'Jl. Merdeka No. 123, Ciledug', 120000, '/images/futsal-b.jpg', '["Locker Room", "Parking", "Cafe"]'),
('Lapangan Badminton', 'Lapangan badminton indoor dengan AC dan pencahayaan optimal', 'Jl. Merdeka No. 123, Ciledug', 80000, '/images/badminton.jpg', '["AC", "Locker Room", "Parking"]'),
('Lapangan Basket', 'Lapangan basket outdoor dengan permukaan berkualitas', 'Jl. Merdeka No. 123, Ciledug', 100000, '/images/basket.jpg', '["Parking", "Cafe"]');

-- Insert sample schedules
INSERT INTO field_schedules (field_id, day_of_week, start_time, end_time) VALUES
(1, 'monday', '06:00:00', '22:00:00'),
(1, 'tuesday', '06:00:00', '22:00:00'),
(1, 'wednesday', '06:00:00', '22:00:00'),
(1, 'thursday', '06:00:00', '22:00:00'),
(1, 'friday', '06:00:00', '22:00:00'),
(1, 'saturday', '06:00:00', '22:00:00'),
(1, 'sunday', '06:00:00', '22:00:00'),
(2, 'monday', '06:00:00', '22:00:00'),
(2, 'tuesday', '06:00:00', '22:00:00'),
(2, 'wednesday', '06:00:00', '22:00:00'),
(2, 'thursday', '06:00:00', '22:00:00'),
(2, 'friday', '06:00:00', '22:00:00'),
(2, 'saturday', '06:00:00', '22:00:00'),
(2, 'sunday', '06:00:00', '22:00:00'),
(3, 'monday', '06:00:00', '22:00:00'),
(3, 'tuesday', '06:00:00', '22:00:00'),
(3, 'wednesday', '06:00:00', '22:00:00'),
(3, 'thursday', '06:00:00', '22:00:00'),
(3, 'friday', '06:00:00', '22:00:00'),
(3, 'saturday', '06:00:00', '22:00:00'),
(3, 'sunday', '06:00:00', '22:00:00'),
(4, 'monday', '06:00:00', '22:00:00'),
(4, 'tuesday', '06:00:00', '22:00:00'),
(4, 'wednesday', '06:00:00', '22:00:00'),
(4, 'thursday', '06:00:00', '22:00:00'),
(4, 'friday', '06:00:00', '22:00:00'),
(4, 'saturday', '06:00:00', '22:00:00'),
(4, 'sunday', '06:00:00', '22:00:00');
