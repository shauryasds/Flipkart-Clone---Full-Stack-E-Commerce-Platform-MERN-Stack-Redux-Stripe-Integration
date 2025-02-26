import { BrowserRouter as Router,Routes, Route } from "react-router-dom";

import Home from "./page/Home";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./page/Login";
import Signup from "./page/Signup";
import CategoryPage from "./page/CategoryPage";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import UserProfile from "./page/UserProfile";
import AdminDashboard from "./page/AdmiDashboard";
import ProductPage from "./page/ProductPage";
import CartPage from "./page/CartPage";
import CheckoutPage from "./page/CheckoutPage"; 
import PaymentVerification from "./page/PaymentVerificationPage";
import PaymentSuccess from "./component/PaymentSuccess";
import PaymentCancel from "./component/PaymentCancel";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((state) => state.userSlice);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => (
  <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>
);


function App() {
  
    return (
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/category/:category" element={<CategoryPage/>} />
          <Route path="/product/:id" element={<ProductPage />} />
  
          {/* Protected Routes */}
          <Route path="/userprofile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/Cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
  
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
  
          <Route path="/payment-verification/:orderId" element={
          
              <PaymentVerification />
           
          } />
  
          {/* Admin-only Route */}
          <Route path="/Admindashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
  
          <Route path="/order/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
        <Footer/>
      </Router>
    );
  
}

export default App
