// pages/api/payfast/getAccessToken.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PAYFAST_BASE_URL = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merchant_id, secured_key, basket_id, trans_amount, currency_code } = req.query;

  try {
    const response = await axios.post(`${PAYFAST_BASE_URL}/GetAccessToken`, null, {
      params: {
        MERCHANT_ID: merchant_id,
        SECURED_KEY: secured_key,
        BASKET_ID: basket_id,
        TXNAMT: trans_amount,
        CURRENCY_CODE: currency_code,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).json({ message: 'Error fetching access token' });
  }
}