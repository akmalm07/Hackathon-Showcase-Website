import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import './style/root.css';
import logo from './logo.svg';
import videoFile from './vendors/coding-vid.mp4';


function NavbarList({ setModal = () => {} }) {

  return (
  <>
    <ul>
      <li><a onClick={() => setModal(false)} href="#About-Sec">About</a></li>
      <li><a onClick={() => setModal(false)} target="_blank" rel="noopener noreferrer" href="TODO: Make google form">Join</a></li>
      <li><Link to="/faq" onClick={() => setModal(false)}>FAQ</Link></li>
      <li><Link to="/ai" onClick={() => setModal(false)}>Chat with Bot</Link></li>
    </ul>
  </>
  );
}


function NavBar() {
  const [flipped, setFlipped] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogAnimating, setIsDialogAnimating] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle navbar and modal
  const toggleNavBar = () => {
    setFlipped((prev) => !prev);
    if (!isDialogOpen) {
      setIsDialogOpen(true);
      // Start animation after mount
      setTimeout(() => setIsDialogAnimating(true), 10);
    } else {
      closeModalAnimation();
    }
  };

  // Close modal with animation
  const closeModalAnimation = () => {
    setIsDialogAnimating(false); // start exit animation
    setTimeout(() => setIsDialogOpen(false), 350); // unmount after animation
  };

  // Overlay click handler
  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      toggleNavBar();
    }
  };

  return (
    <header>
      <div className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
        <img className="logo" src={logo} alt="Logo" />

        <NavbarList />

        <button
          id="toggle-bars"
          className={flipped ? "spin" : ""}
          onClick={toggleNavBar}
        >
          ☰
        </button>
      </div>

      {isDialogOpen && (
        <div className={`modal-overlay ${isDialogAnimating ? "active" : ""}`} onClick={closeModal}>
          <div className={`modal ${isDialogAnimating ? "fly-out-in" : ""}`}>
            <h2>Dashboard</h2>
            <NavbarList setModal={setIsDialogAnimating} />
          </div>
        </div>
      )}
    </header>
  );
}



//Global variables for the typing effect
const wordList = ["Code", "Build", "Create"];
const typingDelay = 100;
const erasingDelay = 60;
const newWordDelay = 1500;


function HomeFront() {

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
    <section className="home-front">
      <video autoPlay muted loop className="background-video">
        <source src={videoFile} type="video/mp4" />
      </video>
      <div className="home-front-content">
        <h1>Welcome to the <br></br> MBHS Hackathon!</h1>
        <p>
          Are you ready to <span ref={typedTextRef} className="typed-text"></span>
          <span className="blinking-underscore">_</span>?
        </p>
        <a href="TODO" className="join-button">Join Now!</a>
      </div>
    </section>
  );
}

export default function Home() 
{
  return (
  <>
  <NavBar/>
  <HomeFront/>
  </>
  );
}

