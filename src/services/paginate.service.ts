// // src/services/pagination.service.ts

// import { HttpService } from "./base.service";

// class PaginationService extends HttpService {
//   private readonly prefix: string = "admin";

//   async fetchCategories(): Promise<any> {
//     try {
//       const response = await this.get(`${this.prefix}/category`);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//       throw error;
//     }
//   }

//   async fetchProducts(categoryId: string, page: number, limit: number): Promise<any> {
//     try {
//       const response = await this.get(`${this.prefix}/product`, {
//         params: {
//           category_id: categoryId,
//           page,
//           limit,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//       throw error;
//     }
//   }
// }

// export const paginationService = new PaginationService();


// src/services/payment.service.ts
import axios from 'axios';

interface PayFastPaymentData {
  merchant_id: string;
  secured_key: string;
  basket_id: string;
  trans_amount: string;
  currency_code: string;
  customer_email: string;
  customer_mobile: string;
  success_url: string;
  failure_url: string;
  checkout_url: string;
  order_date: string;
  store_name: string;
  txndesc?: string;
}

/**
 * Initiates a PayFast payment by obtaining an access token and redirecting to the payment gateway
 * @param paymentData Payment details required for processing the transaction
 */
export const initiatePayFastPayment = async (paymentData: PayFastPaymentData): Promise<void> => {
  try {
    // Step 1: Get access token from PayFast
    const token = await getPayFastAccessToken({
      merchant_id: paymentData.merchant_id,
      secured_key: paymentData.secured_key,
      basket_id: paymentData.basket_id,
      trans_amount: paymentData.trans_amount,
      currency_code: paymentData.currency_code
    });

    if (!token) {
      throw new Error('Failed to obtain PayFast access token');
    }

    // Step 2: Prepare form data for the payment request
    const formData = {
      CURRENCY_CODE: paymentData.currency_code,
      MERCHANT_ID: paymentData.merchant_id,
      MERCHANT_NAME: paymentData.store_name,
      TOKEN: token,
      BASKET_ID: paymentData.basket_id,
      TXNAMT: paymentData.trans_amount,
      ORDER_DATE: paymentData.order_date,
      SUCCESS_URL: paymentData.success_url,
      FAILURE_URL: paymentData.failure_url,
      CHECKOUT_URL: paymentData.checkout_url,
      CUSTOMER_EMAIL_ADDRESS: paymentData.customer_email,
      CUSTOMER_MOBILE_NO: paymentData.customer_mobile,
      SIGNATURE: generateSignature(paymentData.merchant_id, token),
      VERSION: 'MERCHANTCART-1.0',
      TXNDESC: paymentData.txndesc || 'Order Payment',
      PROCCODE: '00',
      TRAN_TYPE: 'ECOMM_PURCHASE'
    };

    // Step 3: Create and submit a form to redirect to PayFast
    submitPaymentForm(formData);
  } catch (error) {
    console.error('PayFast payment initiation failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Payment gateway error');
  }
};

/**
 * Gets an access token from PayFast API
 */
const getPayFastAccessToken = async ({
  merchant_id,
  secured_key,
  basket_id,
  trans_amount,
  currency_code
}: {
  merchant_id: string;
  secured_key: string;
  basket_id: string;
  trans_amount: string;
  currency_code: string;
}): Promise<string> => {
  try {
    const response = await axios.post('/api/payfast', {
      MERCHANT_ID: merchant_id,
      SECURED_KEY: secured_key,
      BASKET_ID: basket_id,
      TXNAMT: trans_amount,
      CURRENCY_CODE: currency_code
    });

    if (!response.data || !response.data.ACCESS_TOKEN) {
      console.error('Invalid token response:', response.data);
      throw new Error('Failed to retrieve access token');
    }

    return response.data.ACCESS_TOKEN;
  } catch (error) {
    console.error('Error getting PayFast access token:', error);
    throw error;
  }
};


/**
 * Generate a signature for PayFast transaction
 * Note: Implement actual signature generation algorithm as required by PayFast
 */
const generateSignature = (merchantId: string, token: string): string => {
  // This is a placeholder. In production, implement the actual signature
  // algorithm as specified by PayFast documentation
  const timestamp = new Date().getTime();
  return `SIG-${merchantId}-${timestamp}`;
};

/**
 * Creates and submits a form to redirect to PayFast payment page
 */
const submitPaymentForm = (formData: Record<string, string>): void => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
  form.style.display = 'none';

  // Add all form fields
  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  // Add form to body and submit
  document.body.appendChild(form);
  form.submit();
};