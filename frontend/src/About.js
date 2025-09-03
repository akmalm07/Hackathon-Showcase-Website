import "./style/about.css"
import "./style/seporator.css"

import { School, Heart, Star } from "lucide-react"; // Delete later and repace with real icons

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
                    title="Who We Are" 
                    text="We’re the Millennium Brooklyn High School CS Club, a group of students
                          passionate about coding, problem-solving, and building creative projects together."
                    Icon={School} 
                />
                <Separator 
                    title="Our Mission" 
                    text="We aim to inspire curiosity, teamwork, and innovation by hosting events 
                          like hackathons that bring students together to learn and create."
                    Icon={Star} 
                />
                <Separator 
                    title="Why It Matters" 
                    text="Hackathons give students a chance to turn ideas into reality, gain real 
                          experience, and build skills that go beyond the classroom. Plus, they’re a lot of fun!" 
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