import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import Home from './Home';
import { NavBar, ChatButton } from './NavBar';
import About from './About';
import Chat from './Chat';
import Footer from './Footer';
import Legal from './Legal';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element=
        { 
          <>
            <NavBar />
            <ChatButton />
            <Home />  
            <About />
          {/* -- Add the Join Page Here --- */}
           <Footer />

          </>
        } />
        <Route path="/faq" element=
        {
          <>
            <NavBar />
            <ChatButton />
            <FAQ />
          </>
        } />
        <Route path="/ai" element=
        {
          <>
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

      </Routes>
    </Router>
  );
}
