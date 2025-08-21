import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import { Home, NavBar } from './Home';
import About from './About';
import Footer from './Footer';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element=
        { 
          <>
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
           <FAQ />
          </>
        } />
        <Route path="/ai" element=
        {
          <>
           {/* AI Section to add */}
          </>
        } />
        <Route path="/legal" element=
        {
          <>
           {/* Legal Section to add */}
          </>
        } />

      </Routes>
    </Router>
  );
}
