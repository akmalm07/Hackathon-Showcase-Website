import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import Home from './Home';
import { NavBar, ChatButton } from './NavBar';
import About from './About';
import Chat from './Chat';
import Footer from './Footer';
import Legal from './Legal';
import Join from './Join';
import LaserMouse from './LazerMouse';
// import Upload from './Upload';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element=
        { 
          <>
            <LaserMouse />
            <NavBar />
            <ChatButton />
            <Home />  
            <About />
            <Join />
            {/* <Upload /> */}
           <Footer />

          </>
        } />
        <Route path="/faq" element=
        {
          <>
            <LaserMouse />
            <NavBar />
            <ChatButton />
            <FAQ />
          </>
        } />
        <Route path="/ai" element=
        {
          <>
            <LaserMouse />
            <NavBar />
            <Chat />
          </>
        } />
        <Route path="/legal" element=
        {
          <>
            <NavBar />
            <Legal />
          </>
        } />
        {/* <Route path="/upload" element=
        {
          <>
            <NavBar />
            <Upload />
          </>
        } /> */}
      </Routes>
    </Router>
  );
}

