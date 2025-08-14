import React, { useState, useEffect, useRef } from "react";
import './style/root.css';
import logo from './logo.svg';
import { Link } from 'react-router-dom';
import videoFile from './vendors/coding-vid.mp4';

export function NavBar()
{
  return (
    <header>
        <div className="nav-bar">
            <img className="logo" src={logo}/>

            <ul>
            <li><a href="#About-Sec">About</a></li>
            <li><a target="_blank" href="TODO: Make google form">Join</a></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/ai">Chat with Bot</Link></li>
            </ul>
        </div>
        <div className="toggle-bars">☰</div>
    </header>

  )
}

const wordList = ["Code", "Build", "Create"];
const typingDelay = 100;
const erasingDelay = 60;
const newWordDelay = 1500;

function HomeFront() {
  const typedTextRef = useRef(null);
  const typingTimeout = useRef(null);
  const erasingTimeout = useRef(null);

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;

    function type() {
      if (typedTextRef.current) {
        if (charIndex < wordList[wordIndex].length) {
          typedTextRef.current.textContent += wordList[wordIndex][charIndex];
          charIndex++;
          typingTimeout.current = setTimeout(type, typingDelay);
        } else {
          typingTimeout.current = setTimeout(erase, newWordDelay);
        }
      }
    }

    function erase() {
      if (typedTextRef.current) {
        if (charIndex > 0) {
          typedTextRef.current.textContent = wordList[wordIndex].substring(0, charIndex - 1);
          charIndex--;
          erasingTimeout.current = setTimeout(erase, erasingDelay);
        } else {
          wordIndex = (wordIndex + 1) % wordList.length;
          typingTimeout.current = setTimeout(type, typingDelay);
        }
      }
    }

    typingTimeout.current = setTimeout(type, newWordDelay);

    return () => {
      clearTimeout(typingTimeout.current);
      clearTimeout(erasingTimeout.current);
    };
  }, []);

  return (
    <section className="home-front">
      <video autoPlay muted loop className="background-video">
        <source src={videoFile} type="video/mp4" />
      </video>
      <div className="home-front-content">
        <h1>Welcome to the MBHS Hackathon!</h1>
        <p>
          Are you ready to <span ref={typedTextRef} className="typed-text"></span>?
        </p>
      </div>
    </section>
  );
}

export function Home() 
{
  return (
  <>
  <NavBar/>
  <HomeFront/>
  </>);
}

