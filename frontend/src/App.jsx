import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import TreePage from './pages/treePage';

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Creative Coding Projects</h1>
        <p className="home-subtitle">
          Small generative sketches and visual experiments.
        </p>
      </header>

      <nav className="home-nav">
        <ul className="home-nav__list">
          <li className="home-nav__item">
            <Link className="home-nav__link" to="/trees">
              Fractal Tree Generator
            </Link>
            <p className="home-nav__description">
              Explore recursive trees with different angles, lengths, and depths.
            </p>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trees" element={<TreePage />} />
      </Routes>
    </Router>
  );
}

export default App;
