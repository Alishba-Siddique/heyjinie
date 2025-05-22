// src/components/page-ui/faq.tsx
'use client';
import { useState } from 'react';

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I redeem a gift I received?',
      answer:
        'To redeem your gift:\n1. Open the email or app notification and click the "Claim Your Gift" button.\n2. Sign in or enter your registered email to access your gift.\n3. Tap on the gifted product to view its details.\n4. Use the store locator to find the nearest participating store.\n5. Visit the store and show your unique product code at checkout.\n6. The store will verify your code, and you can enjoy your gift!',
    },
    {
      question:
        'I can’t find a nearby store to redeem my gift. What should I do?',
      answer:
        'If no stores appear in the locator:\n- Ensure your location services are enabled on your device.\n- If no stores are available in your area, contact HeyJinie Support for assistance.',
    },
    {
      question: 'My product code isn’t working at the store. What should I do?',
      answer:
        '1. Double-check that you are at a participating store.\n2. Ensure your product code hasn’t expired (check the expiration date in the app).\n3. Show the cashier the product details in the HeyJinie app for verification.\n4. If the issue persists, contact HeyJinie Support immediately.',
    },
    {
      question: 'Can I send a HeyJinie gift to someone in another city?',
      answer: 'Yes, HeyJinie gifts can be sent all across Pakistan.',
    },
    {
      question: 'How do I check my gift balance or expiration date?',
      answer:
        'Open the HeyJinie app and go to the <a href="/my-gifts" target="_blank" className="text-blue-600 underline">My Gifts</a> section.',
    },
    {
      question: 'Can I exchange my gift for another item or cash?',
      answer:
        'HeyJinie gifts can be exchanged for another product of the same brand.',
    },
    {
      question: 'What if I accidentally deleted my gift email?',
      answer:
        'No worries! Just log into the HeyJinie app or website, go to <a href="/my-gifts" target="_blank" className="text-blue-600 underline">My Gifts</a>, and access your gift details there.',
    },
    {
      question: 'How do I contact HeyJinie support?',
      answer:
        'You can reach HeyJinie Support via:\n- <a href="mailto:support@heyjinie.com"><strong>Email</strong>: <span className="text-blue-600 underline">support@heyjinie.com</span></a>\n- <a href="/live-chat" target="_blank"><b>Live Chat</b></a>: Available in the HeyJinie app',
    },
  ];

  return (
    <div className="w-full float-left ">
      <div className="at-pagesectiontitle ml-3">
        <h2>Frequently Asked Questions (FAQs)</h2>
      </div>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b ${activeIndex === index ? 'bg-[#F0F5F2]' : ''}`}
        >
          <button
            className="w-full text-left p-4 font-medium flex justify-between items-center text-[#40A574] hover:text-[#40A574] focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            {faq.question}
            <span
              className={`transform transition-transform ${
                activeIndex === index ? 'rotate-180' : ''
              }`}
            >
              <svg
                width="19"
                height="10"
                viewBox="0 0 19 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8938 0.404171C16.1509 0.169491 16.4893 0.0391132 16.8412 0.0521509C17.193 0.0521509 17.5179 0.182529 17.775 0.430247C18.0186 0.664928 18.1675 0.990872 18.1675 1.32986C18.1675 1.66884 18.0457 1.99478 17.8021 2.2425L10.1419 9.6219C10.0201 9.73924 9.87124 9.83051 9.70883 9.8957C9.54643 9.96089 9.37049 10 9.19455 10C9.01861 10 8.84267 9.96089 8.66673 9.8957C8.50432 9.83051 8.35545 9.73924 8.23365 9.6219L0.573495 2.2425C0.451691 2.12516 0.34342 1.98175 0.275751 1.82529C0.208082 1.6558 0.16748 1.48631 0.16748 1.31682C0.16748 1.14733 0.194548 0.964798 0.262217 0.808344C0.329886 0.651891 0.438157 0.508474 0.559961 0.378097C0.681766 0.260756 0.844172 0.169492 1.00658 0.104302C1.16898 0.0260753 1.34492 -5.72317e-08 1.5344 -6.64414e-08C1.71034 -7.49933e-08 1.88628 0.0391139 2.04868 0.104302C2.21109 0.169492 2.35996 0.273794 2.4953 0.404172L9.19455 6.85789L10.4532 5.63233L15.8938 0.404171Z"
                  fill="#434343"
                />
              </svg>
            </span>
          </button>
          {activeIndex === index && faq.answer && (
            <pre
              className="p-4 text-gray-600 font-[poppins]"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
