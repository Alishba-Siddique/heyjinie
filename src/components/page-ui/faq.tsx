import React, { useState } from "react";

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Starbucks?",
      answer:
        "Consequat velit qui cupidatat sint do reprehenderit ad laborum tempor ullamco exercitation. Ullamco tempor adipisicing et voluptate duis sit esse aliqua.",
    },
    { question: "How Can Help You?", answer: "" },
    { question: "How to create this account?", answer: "" },
    { question: "How to reset password?", answer: "" },
    { question: "How Can Help You?", answer: "" },
  ];

  return (
    <div className="w-full float-left">
        <div className="w-full float-left">
        {faqs.map((faq, index) => (
            <div
            key={index}
            className={`border-b ${
                activeIndex === index ? "bg-[#F0F5F2]" : ""
            }`}
            >
            <button
                className="w-full text-left p-4 font-medium flex justify-between items-center text-[#40A574] hover:text-[#40A574] focus:outline-none"
                onClick={() => toggleAccordion(index)}
            >
                {faq.question}
                <span
                className={`transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                }`}
                >
                    <svg width="19" height="10" viewBox="0 0 19 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8938 0.404171C16.1509 0.169491 16.4893 0.0391132 16.8412 0.0521509C17.193 0.0521509 17.5179 0.182529 17.775 0.430247C18.0186 0.664928 18.1675 0.990872 18.1675 1.32986C18.1675 1.66884 18.0457 1.99478 17.8021 2.2425L10.1419 9.6219C10.0201 9.73924 9.87124 9.83051 9.70883 9.8957C9.54643 9.96089 9.37049 10 9.19455 10C9.01861 10 8.84267 9.96089 8.66673 9.8957C8.50432 9.83051 8.35545 9.73924 8.23365 9.6219L0.573495 2.2425C0.451691 2.12516 0.34342 1.98175 0.275751 1.82529C0.208082 1.6558 0.16748 1.48631 0.16748 1.31682C0.16748 1.14733 0.194548 0.964798 0.262217 0.808344C0.329886 0.651891 0.438157 0.508474 0.559961 0.378097C0.681766 0.260756 0.844172 0.169492 1.00658 0.104302C1.16898 0.0260753 1.34492 -5.72317e-08 1.5344 -6.64414e-08C1.71034 -7.49933e-08 1.88628 0.0391139 2.04868 0.104302C2.21109 0.169492 2.35996 0.273794 2.4953 0.404172L9.19455 6.85789L10.4532 5.63233L15.8938 0.404171Z" fill="#434343"/>
                    </svg>
                </span>
            </button>
            {activeIndex === index && faq.answer && (
                <div className="p-4 text-gray-600">{faq.answer}</div>
            )}
            </div>
        ))}
        </div>
    </div>
  );
};

export default FAQAccordion;