import './style/faq.css';

import { useState } from "react";

export default function FAQ() {
  // Track which FAQ is open
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 3", answer: "Answer to question 3." },
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggleFAQ(index)}
          >
            {faq.question}
            <span className="arrow">{openIndex === index ? "▲" : "▼"}</span>
          </button>
          {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </section>
  );
}