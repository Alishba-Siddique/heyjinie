// src/components/page-ui/return_policy_page.tsx

import Link from 'next/link';

export default function Return_Policy() {
  return (
    <>
      <div className="at-termsandcondiationholder">
        <div className="at-termsandcondition">
          <h1 className="text-3xl font-bold mb-6">Return Policy</h1>
          <p>
            <span className="font-bold text-xl">Eligibility for Returns</span>
            <br />
            <br />
            Returns are accepted only in cases where the item delivered is
            defective, damaged, expired (if applicable), does not match the
            description, or is incorrect. Non-returnable items include digital
            products, personalized gifts, perishable items such as flowers or
            food, and products marked as "final sale" or "non-returnable" at the
            time of purchase. Process for Returns
            <br />
            <br />
            To initiate a return, users must submit a return request via the
            Heyjinie Platform or customer support within 48 hours of delivery.
            They must provide detailed reasons along with photographic evidence
            of the issue. Vendors will assess the request and confirm its
            eligibility. If approved, users will receive instructions for
            returning the item to the Vendor.
            <br />
            <br />
            <span className="font-bold text-xl">
              Delivery Charges for Returns
            </span>
            <br />
            <br />
            Return shipping charges will be borne by the customer unless the
            return is due to faulty or incorrect delivery by the Vendor, or the
            delivery of a damaged or defective item. Return costs will be
            communicated during the return process.
            <br />
            <br />
            <span className="font-bold text-xl">Refund for Returns</span>
            <br />
            <br />
            Refunds for eligible returns will be processed within 7-10 business
            days after the returned item is received and inspected by the
            Vendor. Refunds will be credited to the original payment method or
            as a Heyjinie wallet balance for future use.
            <br />
            <br />
            <span className="font-bold text-xl">
              Cancellation Policy Heyjinie
            </span>
            <br />
            <br />
            <span className="font-bold text-xl">
              User-Initiated Cancellations
            </span>
            <br />
            <br />
            Users can cancel their orders only before the Vendor begins
            processing the request. Once processing has started or the order has
            been dispatched, cancellation is no longer possible. To cancel an
            order, log in to your Heyjinie account, navigate to "My Orders," and
            select the order to cancel. Alternatively, contact Heyjinie's
            customer support via email or phone. Certain items, including
            customized products, digital goods, and perishable items, may not be
            eligible for cancellation.
            <br />
            <br />
            <span className="font-bold text-xl">
              Vendor-Initiated Cancellations
            </span>
            <br />
            <br />
            Vendors may cancel orders due to unavailability, delivery
            constraints, or pricing errors. Users will be notified via email or
            push notifications.
            <br />
            <br />
            <span className="font-bold text-xl">
              Refunds for Canceled Orders
            </span>
            <br />
            <br />
            Refunds for canceled orders will be credited to the Heyjinie Wallet
            and can be used for future purchases. Refunds are typically
            processed within 3-5 business days.
            <br />
            <br />
            <span className="font-bold text-xl">Additional Terms</span>
            <br />
            <br />
            Frequent or unjustified cancellations may result in account
            restrictions. Refunds and cancellations may be delayed during
            unforeseen circumstances like natural disasters. For issues with
            cancellations, contact Heyjinie Customer Support at
            <a href="mailto:support@heyjinie.com" className="text-blue-600">
              {' '}
              support@heyjinie.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
