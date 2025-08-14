import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import { Home, NavBar } from './Home';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element=
        { <> <Home /> </>} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}


NavBar()
