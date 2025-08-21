import './style/faq.css';
import { useState, useRef, useEffect } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqRefs = useRef([]); // refs to each answer wrapper

  const faqData = [
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
    { question: "Question 1", answer: "Answer to question 1." },
    { question: "Question 2", answer: "Answer to question 2." },
    { question: "Question 3", answer: "Answer to question 3." },
  ];

  const toggleFAQ = (index) => {
    const newElement = faqRefs.current[index];
    if (!newElement) return;

    // Close previously open FAQ if it's not the clicked one
    if (openIndex !== null && openIndex !== index) {
      const oldElement = faqRefs.current[openIndex];
      if (oldElement) {
        oldElement.style.height = `${oldElement.scrollHeight}px`;
        requestAnimationFrame(() => {
          oldElement.style.height = '0';
        });
      }
    }

    // Toggle clicked FAQ
    if (openIndex === index) {
      // Close
      newElement.style.height = `${newElement.scrollHeight}px`;
      requestAnimationFrame(() => {
        newElement.style.height = '0';
      });
      setOpenIndex(null);
    } else {
      // Open
      newElement.style.height = `${newElement.scrollHeight}px`;
      setOpenIndex(index);
      // After transition, set height to auto for smooth content change
      newElement.addEventListener(
        'transitionend',
        () => {
          if (openIndex === index) newElement.style.height = 'auto';
        },
        { once: true }
      );
    }
  };

  // Keep refs array in sync
  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, faqData.length);
  }, [faqData.length]);

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            <span>{faq.question}</span>
            <span className="arrow">▼</span>
          </button>
          <div
            ref={el => faqRefs.current[index] = el}
            className="faq-answer-wrapper"
          >
            <p className="faq-answer">{faq.answer}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
