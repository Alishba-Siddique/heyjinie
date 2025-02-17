"use client";
import { NextPage } from 'next';
import { useSearchParams, useRouter } from 'next/navigation';

const FailurePage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters
  const err_code = searchParams.get('err_code');
  const err_msg = searchParams.get('err_msg');

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
            style={{ color: '#FF0000', fontSize: '100px', lineHeight: '200px' }}
          >
            ✗
          </span>
        </div>
        <h1
          style={{
            color: '#FF0000',
            fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
            fontWeight: 900,
            fontSize: '40px',
            marginBottom: '10px',
          }}
        >
          Failed
        </h1>
        <p
          style={{
            color: '#404F5E',
            fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
            fontSize: '20px',
            margin: '0',
          }}
        >
          Payment Not Received
          <br />
          Try Again
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
          Error Code: {err_code} <br />
          Error Message: {err_msg} <br />
        </pre>
        <button
          style={{
            background: '#FF0000',
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

export default FailurePage;
