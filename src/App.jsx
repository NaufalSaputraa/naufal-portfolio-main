import { useEffect, useState } from 'react';
import { Terminal, BookOpen } from 'lucide-react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';
import MatrixRain from './components/MatrixRain';
import GithubStats from './components/GithubStats';
import SEO from './components/SEO';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import CyberCursor from './components/ui/CyberCursor';

function App() {
  const [showMatrix, setShowMatrix] = useState(false);
  const { isProMode, toggleMode } = useTheme();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with native anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute('href'));
      });
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 ${isProMode ? 'bg-background-light text-text-dominant' : 'bg-background-dark text-white'}`}>
      <SEO />

      <CyberCursor />

      {/* TOMBOL TOGGLE MODE (Reader View vs Hacker View) */}
      <button
        onClick={toggleMode}
        className="fixed bottom-5 left-5 z-50 bg-white/90 backdrop-blur-sm text-slate-900 px-5 py-2.5 rounded-full shadow-2xl border border-slate-200 flex items-center gap-3 hover:bg-slate-50 hover:scale-105 transition-all duration-300 cursor-pointer group"
      >
        {isProMode ? (
          // TAMPILAN SAAT READER VIEW AKTIF
          <>
            <div className="relative">
              <BookOpen size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="font-bold text-sm font-sans tracking-wide text-slate-700">Reader View</span>
          </>
        ) : (
          // TAMPILAN SAAT HACKER VIEW AKTIF
          <>
            <Terminal size={18} className="text-slate-900 group-hover:text-emerald-600 transition-colors" />
            <span className="font-bold text-sm font-mono tracking-wider">Hacker View</span>
          </>
        )}
      </button>


      {/* 🔥 BAGIAN PENTING 2: Navbar ditaruh disini, sejajar dengan konten utama */}
      <Navbar />

      {/* 🔥 BAGIAN PENTING 3: Konten Website Utama dibungkus wrapper ini dengan z-10 */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-20">
        <Hero triggerHack={() => !isProMode && setShowMatrix(true)} />
        <GithubStats />
        <Projects />
        <Skills />
        <Footer />
      </div>

      {/* 🔥 BAGIAN PENTING: Matrix Rain ditaruh PALING BAWAH agar Z-Index Menang 🔥 */}
      <AnimatePresence>
        {showMatrix && !isProMode && <MatrixRain onExit={() => setShowMatrix(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
