// src/components/page-ui/delivery_policy_page.tsx

import Link from 'next/link';

export default function Delivery_Policy() {
  return (
    <>
      <div className="at-termsandcondiationholder">
        <div className="at-termsandcondition">
          <p>
            <span className="text-3xl font-bold mb-6">Delivery Policy</span>
            <br />
            <br />
            At Heyjinie, we are committed to ensuring a seamless and timely
            delivery experience for our users. This Delivery Policy outlines the
            terms and conditions related to the delivery of orders placed
            through our platform.
            <br />
            <br />
            <span className="font-bold text-xl">Delivery Timeframes</span>
            <br />
            <br />
            Delivery times vary depending on the Vendor, product availability,
            and delivery location. Estimated delivery times are displayed during
            the checkout process. Standard delivery times may range from 30
            minutes to 5 business days for physical goods, depending on the
            nature of the order. Delays may occur due to adverse weather
            conditions, vendor or delivery partner constraints, incomplete or
            incorrect delivery address details, or force majeure events.
            <br />
            <br />
            <span className="font-bold text-xl">Delivery Charges</span>
            <br />
            <br />
            Delivery fees are calculated based on the delivery location and
            order type and will be clearly mentioned at checkout. Additional
            charges may apply for express or same-day deliveries, and these
            charges will be communicated before order confirmation.
            <br />
            <br />
            <span className="font-bold text-xl">
              Delivery Address Guidelines
            </span>
            <br />
            <br />
            Users are required to provide a complete and accurate delivery
            address, including any specific instructions such as apartment
            numbers or landmarks. Changes to the delivery address after placing
            an order may not always be possible. Please contact customer support
            immediately for assistance. If delivery fails due to incorrect
            address details, unavailability of the recipient, or refusal to
            accept the order, the user may be charged a re-delivery fee.
            <br />
            <br />
            <span className="font-bold text-xl">Order Tracking</span>
            <br />
            <br />
            Users can track the status of their orders through the "My Orders"
            section of the Heyjinie platform. Notifications will be sent at each
            stage of the delivery process. In some cases, users may be able to
            directly communicate with delivery partners for specific
            instructions or updates.
            <br />
            <br />
            <span className="font-bold text-xl">
              Failed or Delayed Deliveries
            </span>
            <br />
            <br />
            If a delivery cannot be completed due to vendor or delivery partner
            issues, Heyjinie will notify the user and provide a resolution,
            which may include re-delivery or refunds to the Heyjinie Wallet. It
            is the user's responsibility to ensure availability at the specified
            delivery address during the estimated delivery window.
            <br />
            <br />
            <span className="font-bold text-xl">Return Deliveries</span>
            <br />
            <br />
            If a return is initiated, users will bear the cost of return
            delivery unless the issue is caused by the Vendor, such as a wrong
            or damaged item. The return delivery charges will be deducted from
            the Heyjinie Wallet refund amount, if applicable.
            <br />
            <br />
            <span className="font-bold text-xl">
              Restrictions and Limitations
            </span>
            <br />
            <br />
            Heyjinie’s delivery services may be limited to specific locations.
            Users are advised to check serviceability for their area during
            checkout. Deliveries cannot be made to restricted areas such as
            government facilities or locations with strict access regulations.
            <br />
            <br />
            <span className="font-bold text-xl">
              Customer Support for Delivery Issues
            </span>
            <br />
            <br />
            Users must report delivery issues, such as missing items, late
            deliveries, or incorrect orders, within 24 hours of receiving the
            order. For assistance, users can email customer support at
            <a href="mailto:support@heyjinie.com" className="text-blue-600">
              {' '}
              support@heyjinie.com
            </a>
            . Heyjinie will coordinate with Vendors and delivery partners to
            resolve issues promptly, which may include re-delivery, refunds, or
            compensation, as applicable.
          </p>
        </div>
      </div>
    </>
  );
}
