import Link from 'next/link';

// Define interfaces for our data structure
interface Subsection {
  subtitle: string;
  content: string;
}

interface TermsSection {
  title: string;
  content?: string;
  subsections?: Subsection[];
}

// Component props interface
interface SectionProps {
  title: string;
  content?: string;
  subsections?: Subsection[];
}

// Create a structured data model for the terms sections
const termsData: TermsSection[] = [
  {
    title: 'Introduction',
    content:
      'Welcome to Heyjinie! Thank you for choosing to use our platform and services. By accessing or using our Services, you acknowledge and agree to abide by the terms and conditions set forth in this document. These Terms create a legally binding agreement between you and Heyjinie, outlining your rights, obligations, and the guidelines for utilizing our platform. We encourage you to read through these Terms carefully to fully understand the rules that govern your use of our Services.',
  },
  {
    title: 'Account Registration and User Responsibilities',
    subsections: [
      {
        subtitle: 'Account Creation',
        content:
          'You must create an account with valid personal information, including your name, contact number, and email address.',
      },
      {
        subtitle: 'Safeguarding Your Account',
        content:
          'You are responsible for safeguarding your login credentials and must notify Heyjinie of any unauthorized account access.',
      },
      {
        subtitle: 'Age Requirement',
        content:
          'Users must be 18 years or older or have parental consent to use the Platform.',
      },
      {
        subtitle: 'Account Termination',
        content:
          'Heyjinie reserves the right to suspend or terminate accounts suspected of fraudulent activity, misuse, or violation of these Terms.',
      },
    ],
  },
  {
    title: 'Service Use and Restrictions',
    subsections: [
      {
        subtitle: 'Permissible Use',
        content:
          'You agree to use the Platform solely for lawful and personal purposes, including but not limited to ordering and sending gifts, and browsing and selecting available products or services.',
      },
      {
        subtitle: 'Prohibited Use',
        content:
          "Users must not submit false or misleading information when placing orders, use the Platform for fraudulent, illegal, or deceptive activities, disrupt the operation of the Platform or abuse its features, or engage in any activity that harms Heyjinie's reputation or infringes upon its intellectual property.",
      },
    ],
  },
  {
    title: 'Placing Orders',
    subsections: [
      {
        subtitle: 'Order Process',
        content:
          'Once an order is placed, it is forwarded to the Vendor for fulfillment. Users are responsible for ensuring all order details (e.g., recipient name, address) are accurate.',
      },
      {
        subtitle: 'Order Confirmation',
        content:
          'Orders are confirmed only after payment is processed and the Vendor accepts the request. Heyjinie will notify you of any rejections or changes to the order.',
      },
      {
        subtitle: 'Delivery',
        content:
          "Delivery times are estimates and depend on the Vendor's fulfillment capabilities. Heyjinie does not guarantee delivery within specified timeframes but will work with Vendors to minimize delays.",
      },
    ],
  },
  {
    title: 'Cancellations and Refunds',
    subsections: [
      {
        subtitle: 'Cancellation Policy',
        content:
          'Orders may be canceled only if the Vendor has not yet started processing the order.',
      },
      {
        subtitle: 'Refunds',
        content:
          "Refund eligibility is subject to the Vendor's policies. Refunds for digital products or personalized gifts may not be available once processing begins.",
      },
      {
        subtitle: 'Refund Processing',
        content:
          "Refunds are processed within a specified timeframe (e.g., 5–10 business days) after approval. Non-Refundable Items: Certain items, such as perishable goods or services specified as non-refundable by the Vendor, are not eligible for refunds. Credit Refunds: Approved refunds will be credited to the user's Heyjinie account balance for future use.",
      },
    ],
  },
  {
    title: 'Cancellations and Refunds',
    subsections: [
      {
        subtitle: 'Cancellation Policy',
        content:
          'Orders may be canceled only if the Vendor has not yet started processing the order.',
      },
      {
        subtitle: 'Refunds',
        content:
          "Refund eligibility is subject to the Vendor's policies. Refunds for digital products or personalized gifts may not be available once processing begins.",
      },
      {
        subtitle: 'Refund Processing',
        content:
          "Refunds are processed within a specified timeframe (e.g., 5–10 business days) after approval. Non-Refundable Items: Certain items, such as perishable goods or services specified as non-refundable by the Vendor, are not eligible for refunds. Credit Refunds: Approved refunds will be credited to the user's Heyjinie account balance for future use.",
      },
    ],
  },
  {
    title: 'Vendor Responsibilities',
    subsections: [
      {
        subtitle: 'Vendor Obligations',
        content:
          'The quality, safety, and compliance of products or services listed on the Platform are the responsibility of the Vendor. Vendors are also responsible for ensuring accurate and up-to-date product descriptions, pricing, and availability. They must resolve disputes related to defective or delayed orders and comply with applicable laws and regulations.',
      },
      {
        subtitle: "Heyjinie's Role",
        content:
          'Heyjinie acts solely as a facilitator and is not liable for issues arising from Vendor performance.',
      },
    ],
  },
  {
    title: 'Payments',
    subsections: [
      {
        subtitle: 'Payment Methods',
        content:
          'Heyjinie accepts various payment methods, including credit cards, debit cards, and digital wallets.',
      },
      {
        subtitle: 'Transaction Security',
        content:
          'Heyjinie uses secure payment gateways to protect user information. However, users are responsible for ensuring payment methods are valid and authorized.',
      },
      {
        subtitle: 'Taxes and Fees',
        content:
          'Prices displayed may not include applicable taxes, surcharges, or delivery fees, which will be added during checkout.',
      },
    ],
  },
  {
    title: 'Intellectual Property',
    subsections: [
      {
        subtitle: 'Intellectual Property Ownership',
        content:
          'All content on the Platform, including logos, designs, and text, is the property of Heyjinie or its licensors and is protected by intellectual property laws.',
      },
      {
        subtitle: 'Restrictions',
        content:
          "Users and Vendors may not use, reproduce, or distribute Heyjinie’s intellectual property without prior written consent.",
      },
    ],
  },
  {
    title: 'Limitation of Liability',
    subsections: [
      {
        subtitle: 'Exclusions',
        content:
          'Heyjinie is not responsible for delays, errors, or damages caused by Vendors or third-party delivery partners. We are also not liable for losses resulting from incorrect user information or misuse of the Platform, or force majeure events (such as natural disasters, strikes, etc.).',
      },
    ],
  },
  {
    title: 'Dispute Resolution',
    subsections: [
      {
        subtitle: 'Mediation',
        content:
          'In case of disputes, users may contact Heyjinie’s customer support. We will mediate between users and Vendors to reach a resolution.',
      },
      {
        subtitle: 'Legal Channels',
        content:
          'Disputes that cannot be resolved through mediation may be escalated to legal channels.',
      },
      {
        subtitle: 'Modifications to Terms',
        content:
          'Heyjinie reserves the right to amend these Terms at any time. Changes will be posted on the Platform, and continued use constitutes acceptance of updated Terms.',
      },
    ],
  },
  {
    title: 'Privacy and Data Protection',
    subsections: [
      {
        subtitle: 'Privacy Compliance',
        content:
          'Heyjinie values user privacy and complies with data protection laws.',
      },
      {
        subtitle: 'Data Usage',
        content:
          'For details on how user data is collected, stored, and used, refer to our Privacy Policy.',
      },
    ],
  },
  {
    title: 'Governing Law',
    content:
      'These Terms are governed by the laws of Pakistan. Any legal disputes will be resolved in courts of the relevant jurisdiction.',
  },
];

// Section component for reusability
const Section: React.FC<SectionProps> = ({ title, content, subsections }) => (
  <div className="mb-8">
    <h2 className="font-bold text-xl mb-4">{title}</h2>
    {content && <p className="mb-4">{content}</p>}

    {subsections &&
      subsections.map((subsection, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold text-lg mb-2">{subsection.subtitle}</h3>
          <p>{subsection.content}</p>
        </div>
      ))}

    {/* Add divider except for the last section */}
    {title !== 'Governing Law' && <hr className="my-6" />}
  </div>
);

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="at-termsandcondiationholder">
      <h1 className="text-3xl font-bold mb-2 ml-6">Terms and Conditions</h1>
      <div className="at-termsandcondition p-6 mx-auto">
        {/* Render all sections from the data model */}
        {termsData.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            content={section.content}
            subsections={section.subsections}
          />
        ))}

        {/* Action buttons */}
        {/* <div className="at-btnsubmit at-btnhtermsandcondition at-btnorder">
          <Link href="/home">
            <button type="button" className="at-btn at-btncancel">
              Decline
            </button>
          </Link>
          <Link href="/home">
            <button type="button" className="at-btn">
              Accept
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
