import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { QuitaSmart } from './pages/QuitaSmart';
import { InvestSmart } from './pages/InvestSmart';
import { Login } from './pages/Login';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quita-smart" element={<QuitaSmart />} />
            <Route path="/invest-smart" element={<InvestSmart />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
