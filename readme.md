# PatnaKart - MERN E-Commerce Platform

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-%2343853D?logo=mongodb&logoColor=white)](https://mern.dev)
[![React](https://img.shields.io/badge/React-18.2-%2361DAFB?logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack e-commerce platform featuring product search/filters, user authentication, cart/checkout system, admin panel, and Stripe payments.

![Demo](https://via.placeholder.com/800x400?text=Flipkart+Clone+Demo)

<img width="1470" height="838" alt="image" src="https://github.com/user-attachments/assets/e290ea86-748a-4f06-970a-2159c3c61b0d" />
<img width="1470" height="838" alt="image" src="https://github.com/user-attachments/assets/026a6ebb-3de1-4fd2-92fc-7558e3a4f42e" />
<img width="1470" height="838" alt="image" src="https://github.com/user-attachments/assets/a0e56dfa-5b12-4b7c-b1d2-9f3bc0422e2e" />
<img width="1470" height="838" alt="image" src="https://github.com/user-attachments/assets/c3ce688e-d73d-4614-ace8-b2ae84f20334" />


## ✨ Features
- Product Search & Filters
- User Authentication (JWT)
- Cart & Checkout System
- Admin Dashboard
- Stripe Payment Integration
- Responsive Mobile Design

## 🛠️ Tech Stack
- **Frontend:** React, Redux, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Services:** Stripe API, Cloudinary, JWT

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas cluster
- Stripe API keys

### Installation
1. Clone repository:
```bash
git clone https://github.com/shauryasds/Flipkart-Clone---Full-Stack-E-Commerce-Platform-MERN-Stack-Redux-Stripe-Integration.git
cd Flipkart-Clone---Full-Stack-E-Commerce-Platform-MERN-Stack-Redux-Stripe-Integration



### Backend Setup


cd backend
npm install
cp .env.example .env  # Update values in .env
npm run dev


### Fronntend Setup 



cd ../frontend
npm install
cp .env.example .env  # Update values in .env
npm run start


### 🔧 Environment Variables
backend/.env

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_KEY=your_stripe_key
CLOUDINARY_URL=your_cloudinary_url


### frontend/.env

REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_KEY=your_stripe_publishable_key


### 🤝 Contributing
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
