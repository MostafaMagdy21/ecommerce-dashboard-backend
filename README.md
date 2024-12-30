## E-commerce Dashboard

This project is a web application designed for managing an online store. It includes functionalities for user management, product handling, order processing, cart management, and admin controls. The application leverages a RESTful API architecture, facilitating efficient data exchange between the client and server.

## Features
## User Management
User Registration and Authentication: Users can register, log in, and manage their profiles securely.
Role-Based Access Control: Different roles (e.g., admin, user, owner) determine access levels and functionalities.

## Product Management
CRUD Operations: Admins can create, read, update, and delete products.
Product Categorization: Products can be organized into categories for better navigation.

## Order Processing
Order Management: Users can place orders, and admins can view and manage all orders.
Order Status Updates: Admins can update order statuses (e.g., pending, shipped, completed).

## Cart Functionality
Shopping Cart: Users can add products to their cart, update quantities, and remove items.
Coupon Code Integration: Users can apply discount codes during checkout.

## Admin Dashboard
Admin Controls: Admins can manage user accounts, including creating new admins, updating details, and changing account statuses.
Security Features: Password hashing and authentication tokens ensure secure access.

## Error Handling
Comprehensive error handling to manage invalid requests and server errors gracefully.

## Technologies Used
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens), bcrypt for password hashing
File Uploads: Multer for handling file uploads (e.g., product images)

## Usage
The API can be accessed at http://localhost:5000.
Endpoints are available for user actions, product management, cart operations, and order processing.

Front-End repo : https://github.com/AlyaaRushdy/ecommerce-dashboard-react