import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import Home from './Home';
import About from './About';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element=
        { 
          <>
           <Home />  
           <About />
          </>
        } />
        <Route path="/faq" element=
        {
          <>
           <FAQ />
          </>
        } />
        <Route path="/ai" element=
        {
          <>
           {/* AI Section to add */}
          </>
        } />

      </Routes>
    </Router>
  );
}
