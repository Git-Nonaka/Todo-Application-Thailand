CREATE TABLE user
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username varchar(80) NOT NULL,
    password varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);