import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { QuitaSmart } from './pages/QuitaSmart';
import { InvestSmart } from './pages/InvestSmart';
import { Login } from './pages/Login';
import { UserProvider } from './context/UserContext';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

function App() {
  const [showSplash, setShowSplash] = useState(() => Capacitor.isNativePlatform());

  useEffect(() => {
    if (showSplash) {
      // Hide native splash screen after a small delay to allow React splash to render
      // We use a small timeout to ensure the view is fully painted
      const hideNative = async () => {
        await SplashScreen.hide();
      };

      setTimeout(hideNative, 500);

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <img
          src="/mobile-splash.jpg"
          alt="Splash Screen"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

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
