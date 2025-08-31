import { API_URL } from './config.js'
import './style/faq.css';
import { useState, useRef, useEffect } from "react";


function initialFAQData() {
  return [
        { 
          question: "What is a hackathon?", 
          answer: "A hackathon is an event where participants collaborate intensively to build projects, usually within 24–48 hours." 
        },
        { 
          question: "Who can participate?", 
          answer: "Anyone interested in coding, design, or technology can participate, regardless of experience level." 
        },
        { 
          question: "Do I need to know how to code?", 
          answer: "No! Beginners are welcome. Many participants learn as they go, and there are mentors to help." 
        },
        { 
          question: "How much does it cost?",           
          answer: "Most hackathons are free for participants, and we provide food, swag, and resources." 
        },
        { 
          question: "Can I work in a team?", 
          answer: "Yes! Teams are encouraged, usually with 2–4 members. If you don’t have a team, we’ll help you find one." 
        },
        { 
          question: "What should I bring?", 
          answer: "Bring your laptop, charger, and anything you need to be comfortable. We’ll handle meals and snacks." 
        },
        { 
          question: "Are there prizes?", 
          answer: "Yes! Prizes are awarded for the best projects in different categories, but the main reward is the experience." 
        },
        { 
          question: "Do I need to stay the whole time?", 
          answer: "Not necessarily, but the more time you spend, the more you’ll get out of the event." 
        },
        { 
          question: "Will there be mentors?", 
          answer: "Yes! Industry professionals and experienced hackers will be available to guide participants." 
        },
        { 
          question: "How do I register?", 
          answer: "You can register on our official website. Spots are limited, so sign up early!" 
        }
  ];
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqRefs = useRef([]); // refs to each answer wrapper  
  const [faqData, setFaqData] = useState(initialFAQData());

  useEffect(() => {

    const fetchData = async () => { // Wrapper to allow async functionality
    try {
      const response = await fetch(`${API_URL}/api/faq`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Failed to fetch");

      const responseJson = await response.json();

      if (!Array.isArray(responseJson)) {
        throw new Error("Invalid FAQ data. Data must be an array.");
      }

      setFaqData(prevData => [...responseJson, ...prevData]);

    } catch (error) {
      console.error("Error fetching FAQ data:", error);
    }
  };
  
  fetchData();

  return () => {};
}, []);

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
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`} onClick={() => toggleFAQ(index)}>
          <button className="faq-question">
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
