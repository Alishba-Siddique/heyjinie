"use client";
import { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basket_id = searchParams.get('basket_id'); // Get the basket_id from the query parameter
  const transaction_id = searchParams.get('transaction_id');
  const order_date = searchParams.get('order_date');
  const validation_hash = searchParams.get('validation_hash');

  return (
    <div
      style={{ textAlign: 'center', padding: '40px 0', background: '#EBF0F5' }}
    >
      <div
        style={{
          background: 'white',
          padding: '60px',
          borderRadius: '4px',
          boxShadow: '0 2px 3px #C8D0D8',
          display: 'inline-block',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            borderRadius: '200px',
            height: '200px',
            width: '200px',
            background: '#F8FAF5',
            margin: '0 auto',
          }}
        >
          <span
            style={{ color: '#9ABC66', fontSize: '100px', lineHeight: '200px' }}
          >
            ✓
          </span>
        </div>
        <h1
          style={{
            color: '#88B04B',
            fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
            fontWeight: 900,
            fontSize: '40px',
            marginBottom: '10px',
          }}
        >
          Success
        </h1>
        <p
          style={{
            color: '#404F5E',
            fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
            fontSize: '20px',
            margin: '0',
          }}
        >
          Your payment has been received successfully.
        </p>
        <pre
          style={{
            textAlign: 'left',
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '5px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontSize: '14px',
          }}
        >
          Basket ID: {basket_id} <br />
          Transaction ID: {transaction_id} <br />
          Order Date: {order_date} <br />
          Validation Hash: {validation_hash} <br />
        </pre>
        <button
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
          onClick={() => router.push('/')}
        >
          Go to Shop
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
