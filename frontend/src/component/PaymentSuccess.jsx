import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold mt-4 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        <div className="space-y-2">
          <Link
            to="/userprofile"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            View Orders
          </Link>
          <br />
          <Link
            to="/"
            className="inline-block text-blue-500 hover:text-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;