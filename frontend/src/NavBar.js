import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import chatImg from './vendors/chat-icon.png';
import './style/navbar.css';



function AboutLink({ setModal = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setModal(false);

    if (location.pathname !== "/") {
      // Navigate to home first
      navigate("/", { state: { scrollTo: "About-Sec" } });
    } else {
      // Already on home, just scroll
      const aboutSection = document.getElementById("About-Sec");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <a href="#About-Sec" onClick={handleClick}>
      About
    </a>
  );
}


function NavbarList({ setModal = () => {} }) {

  return (
  <>
    <ul>
      <li><AboutLink setModal={setModal} /></li>
      <li><a onClick={() => setModal(false)} target="_blank" rel="noopener noreferrer" href="TODO: Make google form">Join</a></li>
      <li><Link to="/faq" onClick={() => setModal(false)}>FAQ</Link></li>
      <li><Link to="/ai" onClick={() => setModal(false)}>Chat with Bot</Link></li>
    </ul>
  </>
  );
}


export function NavBar() {
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
    setTimeout(() => setIsDialogAnimating(true), 10);
    setFlipped((prev) => !prev);
    
    if (!isDialogOpen) {
      setIsDialogOpen(true);
    }
  };

  // Close modal with animation
  const closeModalAnimation = () => {
    setIsDialogAnimating(false); // start exit animation
    setTimeout(() => setIsDialogOpen(false), 350);
  };

  // Overlay click handler
  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModalAnimation();
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


export function ChatButton() {
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppear(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link to="/ai" className="chat-button">
      {appear && (
        <div class="chat-wrapper">
        <div class="chat-bubble">Hey, chat with me!</div>
    </div>
    )}
      <img src={chatImg} alt="Chat" className="chat-icon" />
    </Link>
  );
}


