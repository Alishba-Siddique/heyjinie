export default function Checkout_Payment_Page() {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <div className="at-checkoutpaymentholder">
            <div className="checkoutproductitem">
              <div className="at-checkoutproduct">
                <div>
                  <figure className="at-cartproductimage">
                    <img src="" alt="product item" />
                  </figure>
                  <div className="at-cartproductname">
                    <h4>Starbucks</h4>
                    <em>Flta White</em>
                  </div>
                </div>
                <span>$5.99</span>
              </div>
              <div className="at-checkoutproductcountprice">
                <ul>
                  <li>
                    <span>Payment Details</span>
                  </li>
                  <li>
                    <span>Order</span>
                    <span>$66.00</span>
                  </li>
                  <li>
                    <span>Delivery</span>
                    <span>$2.00</span>
                  </li>
                  <li>
                    <span>Total</span>
                    <span>$68.00</span>
                  </li>
                  <li>
                    <span>Address</span>
                    <span>12, WLS Regancy</span>
                  </li>
                </ul>
                <div className="at-btnplaceholder at-btnaddtocart">
                  <a href="javascript: void(0);" className="at-btn at-btn-lg">
                    Place Order
                  </a>
                </div>
              </div>
            </div>
            <div className="at-paymentoptionarea">
              <div className="at-paymentarea">
                <form className="at-formtheme">
                  <fieldset>
                    <div className="form-group">
                      <div className="at-radio">
                        <input type="radio" name="radio" id="radio" />
                        <label htmlFor="radio">
                          Pay with Debit/Credit Card
                        </label>
                      </div>
                      <div className="at-paymentmethodcard">
                        <div className="flex items-center justify-between w-96 p-4 bg-white rounded-lg shadow-lg">
                          <div className="text-lg font-semibold text-gray-800">
                            2873 7868 9087 9037
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-10"></div>
                            <div className="w-10">
                              <img
                                src="/images/pay1.png"
                                alt="Mastercard"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="w-10">
                              <img
                                src="/images/pay2.png"
                                alt="Mastercard"
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="text-blue-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
