import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./index.css"
import { store } from './store/store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import { Bounce } from 'react-toastify';
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
  {/* <React.StrictMode> */}
    <App />
    <ToastContainer
position="top-center"
autoClose={1000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
  {/* </React.StrictMode> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(
  
);
