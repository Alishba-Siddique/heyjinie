// // src/services/payfast.service.ts
// import axios from 'axios';

// const PAYFAST_BASE_URL = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction';

// export const initiatePayFastPayment = async (orderData: any) => {
//   const {
//     merchant_id,
//     secured_key,
//     basket_id,
//     trans_amount,
//     currency_code,
//     customer_email,
//     customer_mobile,
//     success_url,
//     failure_url,
//     checkout_url,
//     order_date,
//     order_id,
//     store_name,
//     service_fee,
//   } = orderData;

//   try {
//     // Step 1: Get Access Token
//     const tokenResponse = await axios.post(`${PAYFAST_BASE_URL}/GetAccessToken`, null, {
//       params: {
//         MERCHANT_ID: merchant_id,
//         SECURED_KEY: secured_key,
//         BASKET_ID: basket_id,
//         TXNAMT: trans_amount,
//         CURRENCY_CODE: currency_code,
//       },
//     });

//     const accessToken = tokenResponse.data.ACCESS_TOKEN;

//     if (!accessToken) {
//       throw new Error('Failed to retrieve access token from PayFast');
//     }

//     // Step 2: Prepare Payment Data
//     const paymentData = {
//       MERCHANT_ID: merchant_id,
//       MERCHANT_NAME: store_name,
//       TOKEN: accessToken,
//       BASKET_ID: basket_id,
//       TXNAMT: trans_amount,
//       CURRENCY_CODE: currency_code,
//       CUSTOMER_EMAIL_ADDRESS: customer_email,
//       CUSTOMER_MOBILE_NO: customer_mobile,
//       ORDER_DATE: order_date,
//       ORDER_ID: order_id,
//       SERVICE_FEE: service_fee,
//       SUCCESS_URL: success_url,
//       FAILURE_URL: failure_url,
//       CHECKOUT_URL: checkout_url,
//       SIGNATURE: 'RANDOMSTRINGVALUE', // Replace with actual signature if required
//       VERSION: 'MY_VER_1.0',
//       TXNDESC: 'Payment for order',
//       PROCCODE: '00',
//     };

//     // Step 3: Redirect to PayFast WebView
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = `${PAYFAST_BASE_URL}/PostTransaction`;

//     Object.entries(paymentData).forEach(([key, value]) => {
//       const input = document.createElement('input');
//       input.type = 'hidden';
//       input.name = key;
//       input.value = value as string;
//       form.appendChild(input);
//     });

//     document.body.appendChild(form);
//     form.submit();

//   } catch (error: any) {
//     console.error('Error initiating PayFast payment:', error);
//     throw error;
//   }
// };



// src/services/payfast.service.ts
import axios from 'axios';

export const initiatePayFastPayment = async (orderData: any) => {
  const {
    merchant_id,
    secured_key,
    basket_id,
    trans_amount,
    currency_code,
    customer_email,
    customer_mobile,
    success_url,
    failure_url,
    checkout_url,
    order_date,
    order_id,
    store_name,
    service_fee,
  } = orderData;
  const PAYFAST_BASE_URL = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction';
  try {
    // Step 1: Get Access Token via the proxy API route
    const tokenResponse = await axios.get('https://ipguat.apps.net.pk/Ecommerce/api/Transaction/api/payfast/getAccessToken', {
      params: {
        merchant_id,
        secured_key,
        basket_id,
        trans_amount,
        currency_code,
      },
    });

    const accessToken = tokenResponse.data.ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('Failed to retrieve access token from PayFast');
    }

    // Step 2: Prepare Payment Data
    const paymentData = {
      MERCHANT_ID: merchant_id,
      MERCHANT_NAME: store_name,
      TOKEN: accessToken,
      BASKET_ID: basket_id,
      TXNAMT: trans_amount,
      CURRENCY_CODE: currency_code,
      CUSTOMER_EMAIL_ADDRESS: customer_email,
      CUSTOMER_MOBILE_NO: customer_mobile,
      ORDER_DATE: order_date,
      ORDER_ID: order_id,
      SERVICE_FEE: service_fee,
      SUCCESS_URL: success_url,
      FAILURE_URL: failure_url,
      CHECKOUT_URL: checkout_url,
      SIGNATURE: 'RANDOMSTRINGVALUE', // Replace with actual signature if required
      VERSION: 'MY_VER_1.0',
      TXNDESC: 'Payment for order',
      PROCCODE: '00',
    };

    // Step 3: Redirect to PayFast WebView
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${PAYFAST_BASE_URL}/PostTransaction`;

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

  } catch (error: any) {
    console.error('Error initiating PayFast payment:', error);
    throw error;
  }
};