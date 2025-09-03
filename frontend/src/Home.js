import { useEffect, useRef } from 'react';
import './style/home.css';
import { FORM_URL } from './config';
// import videoFile from './vendors/coding-vid.mp4'; -- Video reserved for the Join Section --



//Global variables for the typing effect
const wordList = ['Code', 'Build', 'Create'];
const typingDelay = 100;
const erasingDelay = 60;
const newWordDelay = 1500;


export default function Home() {
  
  // --Typing effect logic
  const typedTextRef = useRef(null);
  const typingTimeout = useRef(null);
  const erasingTimeout = useRef(null);

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;


    const type = () => {
      if (!typedTextRef.current) return;

      if (charIndex < wordList[wordIndex].length) {
        typedTextRef.current.textContent += wordList[wordIndex][charIndex];
        charIndex++;
        typingTimeout.current = setTimeout(type, typingDelay);
      } else {
        typingTimeout.current = setTimeout(erase, newWordDelay);
      }
    };

    const erase = () => {
      if (!typedTextRef.current) return;

      if (charIndex > 0) {
        typedTextRef.current.textContent = wordList[wordIndex].substring(0, charIndex - 1);
        charIndex--;
        erasingTimeout.current = setTimeout(erase, erasingDelay);
      } else {
        wordIndex = (wordIndex + 1) % wordList.length;
        typingTimeout.current = setTimeout(type, typingDelay);
      }
    };

    typingTimeout.current = setTimeout(type, newWordDelay);

    return () => {
      clearTimeout(typingTimeout.current);
      clearTimeout(erasingTimeout.current);
    };
  }, []);
  // --Typing effect logic end


  return (
    <section className='home-front'>
      <div className='home-front-content'>
        <h1>Welcome to the <br></br> MBHS Hackathon!</h1>
        <p>
          Are you ready to <span ref={typedTextRef} className='typed-text'></span>
          <span className='blinking-underscore'>_</span>?
        </p>
        <a href={FORM_URL} target="_blank" rel="noopener noreferrer"><span className='join-button'>Join Now!</span></a>
      </div>
    
    </section>
  );
}


