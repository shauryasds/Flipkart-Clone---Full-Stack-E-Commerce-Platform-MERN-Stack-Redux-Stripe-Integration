import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPaymentStatus } from '../slice/OrderSlice';

function PaymentVerificationPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.orderSlice);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { payload } =  dispatch(checkPaymentStatus(orderId)).then((d)=>{
          if (d?.payload?.status === 'paid') {
              navigate('/order/success');
            } else {
                navigate('/payment/cancel');
              }

        });
        // console.log(payload)
          } catch (error) {
            navigate('/payment/cancel');
            // console.log(error)
      }
    };

    verifyPayment();
  }, [dispatch, orderId, navigate]);

  if (loading) return <div>loading</div>

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        {error && <p className="text-red-500 mb-4">Error Occured</p>}
        <p>Verifying payment status...</p>
      </div>
    </div>
  );
}

export default PaymentVerificationPage;