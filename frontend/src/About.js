//import { useEffect, useRef, useState } from "react";
//import { Link } from 'react-router-dom';
import "./style/about.css"
import "./style/seporator.css"

import { Info, Heart, Star } from "lucide-react"; // Delete later and repace with real icons

function Separator({ title, text, Icon }) 
{
  return (
    <div className="separator-wrapper">
      <div className="separator">
        {Icon && <Icon className="separator-icon" />}
        <h3 className="separator-title">{title}</h3>
        <p className="separator-text">{text}</p>
      </div>
      <div className="separator-line" />
    </div>
  );
};


function AboutSection()
{

    return (
        <>
        <section id="About-Sec">
            <h2>About Us</h2>

            <div className="separator-container">
                <Separator 
                    title="About Us" 
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat." 
                    Icon={Info} 
                />
                <Separator 
                    title="Our Mission" 
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat." 
                    Icon={Star} 
                />
                <Separator 
                    title="Join Us" 
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat." 
                        Icon={Heart} 
                />
            </div>
        
        </section>
        </>
    )
}

export default function About()
{
    return (
        <>
        <AboutSection/>
        </>
  );
}