import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StyleGuide from './pages/Styleguide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StyleGuide />} />
        <Route path="/styleguide" element={<StyleGuide />} />
      </Routes>
    </Router>
  );
}

export default App;

