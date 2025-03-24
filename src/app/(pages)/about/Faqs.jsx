'use client'
import { useState } from "react";

const faqs = [
  {
    question: "How do I book a table?",
    answer:
      "You can easily book a table through our platform by going into your dashboard after logging in and then selecting the restaurant, choosing a time, and confirming your reservation.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can modify or cancel your booking up to 24 hours before your reservation time through your dashboard.",
  },
  {
    question: "What restaurants can I book with Dine Reserve?",
    answer: "We have partnerships with a wide range of top-tier restaurants in various cities, offering diverse dining experiences.",
  },
  {
    question: "Is there a mobile app for Dine Reserve?",
    answer: "No, but we are working on it, for now you can access our services through our website.",
  },
  {
    question: "How can I become a restaurant partner?",
    answer: "You can join our platform by contacting us through our email and providing details about your restaurant. Our team will review and approve your partnership.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 max-w-6xl w-full mx-auto px-6 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-redish text-center mb-6">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-3">
            <button
              className={`w-full text-left px-4 py-3 font-semibold rounded-lg transition-all duration-300 
              bg-black text-white
              border-4 border-redish focus:outline-none`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white mt-2 text-redish rounded-b-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
