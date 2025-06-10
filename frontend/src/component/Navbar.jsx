import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../images/logo.svg';
import logolight from '../images/logolight.png';
import { FaRegUserCircle, FaSearch, FaTimes } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { useLocation } from 'react-router-dom';
import Search from './Search';
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../slice/UserSlice";
import UserTab from './UserTab';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userSlice);
  console.log(user, "user");

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

 const bgColor="bg-blue-600";

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm('');
    }
  };

  return (
    <div className={`sticky top-0 z-50 ${bgColor} shadow-md`}>
      <nav className={`m-auto z-10 h-full w-full ${bgColor} sticky top-0 flex items-center justify-around p-3 transition-transform duration-300 `}>
        {/* Logo */}
        <div className='flex items-center'>
          <Link to="/">
          {bgColor=== "bg-white"? <img src={logo} alt="Logo" className="w-full" />:
            <img src="https://stock.adobe.com/in/images/pk-logo-company-logo-monogram-design-letters-p-and-k/309085340" alt="Logo" className="w-20" />}
          </Link>
        </div>
        {/* Search and User & Cart Section */}
        <div className="px-4 flex items-center flex-grow justify-end gap-3">
          {/* Search Box */}
          <div className={`relative ${isSearchVisible ? 'flex' : 'hidden md:flex'} flex-grow`}>
            <input
              className='w-full bg-slate-100 rounded-md p-3 h-full'
              placeholder='Search for products, brands, and more.'
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="hidden md:block absolute bottom-0 left-0 w-full bg-white shadow-lg z-10">
                <Search query={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
            )}
          </div>
          {/* Search Toggle Button */}
          <button
            className="md:hidden text-black ml-2"
            onClick={toggleSearch}
          >
            {isSearchVisible ? <FaTimes /> : <FaSearch />}
          </button>
          {/* User & Cart */}
          <div className={`flex gap-2 items-center text-white font-bold text-[.8rem] md:text-lg`}>
      {
        !user ? (
          <Link className='pr-1 flex items-center' to="/login">
            <span className={`bg-white hover:bg-white/20 hover:text-white px-4 py-2 rounded-md text-black font-semibold text-sm md:text-base transition-colors`}>
              Login
            </span>
          </Link>
        ) : (
          <>
            <span className='relative pr-1 flex items-center' onClick={() => { setIsUserTabOpen((prev) => !prev) }}>
              <FaRegUserCircle />
              {isUserTabOpen && <UserTab />}
            </span>
            {user?.role==="admin" && ( 
              <Link className=' hidden md:flex items-center' to="/Admindashboard">
                <span className={`bg-white hover:bg-white/20 hover:text-white px-4 py-2 rounded-md text-black font-semibold text-sm md:text-base transition-colors`}>
                  Admin Panel
                </span>
              </Link>
            )}
          </>
        )
      }
      <Link className="flex items-center" to="/cart">
        <CiShoppingCart />
      </Link>
    </div>
        </div>
      </nav>
      {/* Full-Screen Search Box */}
      {isSearchVisible && (
  <div className="fixed top-0 left-0 w-full bg-white flex items-center p-4 z-50 shadow-md">
    <div className="flex-1 relative">
      <input
        className='bg-slate-100 focus:outline-none rounded-md p-3 w-full pr-10'
        placeholder='Search for products, brands, and more.'
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <div className="absolute left-0 right-0 mt-2">
          <Search query={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      )}
    </div>
    <button 
      className="ml-4 text-gray-500 hover:text-gray-700"
      onClick={toggleSearch}
    >
      <FaTimes className="text-lg" />
    </button>
  </div>
)}
    </div>
  );
}

export default Navbar;
