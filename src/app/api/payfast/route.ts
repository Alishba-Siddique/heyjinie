// pages/api/payfast/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

const PAYFAST_BASE_URL = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantid = searchParams.get('merchant_id');
    const secret = searchParams.get('secured_key');

    if (!merchantid || !secret) {
      return NextResponse.json({ message: 'route Missing merchantid or secret' }, { status: 400 });
    }

    const token_url = `${PAYFAST_BASE_URL}/GetAccessToken?MERCHANT_ID=${merchantid}&SECURED_KEY=${secret}`;
    const response = await axios.get(token_url);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching PayFast token:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Error fetching token', error: error.response?.data }, { status: 500 });
  }
}
