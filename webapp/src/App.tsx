import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './pages/Home';
import { QuitaSmart } from './pages/QuitaSmart';
import { InvestSmart } from './pages/InvestSmart';
import { Login } from './pages/Login';

import { Capacitor } from '@capacitor/core';

function App() {
  const [showSplash, setShowSplash] = useState(Capacitor.getPlatform() === 'ios');

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? 'hidden' : 'block'}>
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
      </div>
    </>
  );
}

export default App;
