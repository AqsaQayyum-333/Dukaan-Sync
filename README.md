# Dukaan Sync

## Overview

Dukaan Sync is a modern Full Stack Inventory and Point of Sale (POS) Management System developed for small and medium-sized businesses.

The system helps store owners manage products, categories, suppliers, purchases, sales, stock tracking, user roles, and business operations through a clean and responsive dashboard.

The project follows a role-based access control system where different users have different permissions according to their responsibilities.

---

## Features

### Authentication & Authorization

* Secure Login System
* JWT Authentication
* Role Based Access Control
* Owner, Admin and Staff Roles

### Product Management

* Add Products
* Update Products
* Delete Products
* Product Images
* SKU Management
* Cost Price & Selling Price
* Low Stock Alerts

### Category Management

* Add Categories
* Update Categories
* View Categories

### Supplier Management

* Add Suppliers
* Update Supplier Information
* Supplier Purchase Tracking

### Purchase Management

* Create Purchases
* Supplier Selection
* Product Selection
* Quantity Management
* Cost Price Tracking
* Automatic Stock Increase

### Sales / POS System

* Product Billing Interface
* Shopping Cart
* Quantity Management
* Tax Calculation
* Invoice Generation
* Automatic Stock Deduction

### Dashboard

* Total Products
* Total Sales
* Total Purchases
* Low Stock Products
* Weekly Sales Analytics

### Reports

* Business Insights
* Inventory Monitoring
* Sales Overview

---

## Technologies Used

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Recharts
* React Hot Toast

### Backend

* Node.js
* Express.js
* JWT Authentication
* Middleware Based Authorization

### Database

* MongoDB
* Mongoose

### Other Tools

* Git
* GitHub
* Cloudinary

---

## User Roles

### Owner

* Full System Access
* Manage Users
* Manage Products
* Manage Suppliers
* Manage Purchases
* Delete Records

### Admin

* Manage Products
* Manage Categories
* Manage Suppliers
* Manage Purchases
* Manage Sales

### Staff

* Access POS
* Create Sales
* View Assigned Data

---

## Project Structure

```text
Dukaan-Sync
│
├── Backend
│   │
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env
│   └── server.js
│
├── Frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Main Modules

* Authentication System
* User Management
* Product Management
* Category Management
* Supplier Management
* Purchase Management
* POS Billing System
* Dashboard Analytics
* Reports Module

---

## Screenshots

* Login Page
![Login Page Screenshot-1](image-14.png)
![Login Page Screenshot-2](image-15.png)
* Dashboard
![Dashboard Screenshot](image.png)

* Product Management
![Products Management Screenshot-1](image-1.png)
![Products Management Screenshot-2](image-2.png)

* POS Billing Screen
![POS Billing Screenshot-1](image-3.png)
![POS Billing Screenshot-2](image-4.png)

* Purchases Page
![Purchases Page Screenshot-1](image-5.png)
![Purchases Page Screenshot-2](image-6.png)

* Suppliers Ledger
![Supplier Ledger Screenshot-1](image-8.png)
![Supplier Ledger Screenshot-2](image-7.png)

* Reports & Analytics
![Reports & Analytics Screenshot-1](image-9.png)
![Reports & Analytics Screenshot-2](image-10.png)

* Categories Registry
![Categories Screenshot](image-11.png)

* Users (Staff Control Panel)
![Users Screenshot-1](image-12.png)
![Users Screenshot-1](image-13.png)

---

## Installation

### Clone Repository

```bash
git clone <>
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

Create a .env file inside Backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Future Enhancements

* Barcode Scanner Integration
* Online Payments
* Advanced Reporting
* Export to PDF
* Multi Branch Support
* Dark / Light Theme Switching

---

## Academic Information

**Course:** Full Stack Web Development

**Instructor:** Sir Muhammad Rashaf Jamil Khan

**Program:** BS Computer Science

**Semester:** 4th Semester

**Campus:** Air University Multan Campus

---

## License

This Project is Developed for Educational & Academic Purposes as Part of the Full Stack Web Development Course.
