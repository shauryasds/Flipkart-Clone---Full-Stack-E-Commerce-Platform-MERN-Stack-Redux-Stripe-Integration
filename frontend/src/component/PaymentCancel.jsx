import { Link } from 'react-router-dom';

function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <h1 className="text-2xl font-bold mt-4 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">Your payment was not completed.</p>
        <div className="space-y-2">
          <Link
            to="/cart"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Cart
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

export default PaymentCancel;