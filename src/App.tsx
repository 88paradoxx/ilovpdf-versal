import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
  Upload,
  Moon,
  Sun
} from 'lucide-react';
import { ToolId } from './types';
import { storeFile } from './services/fileHandoff';
import { getToolPath } from './utils/routes';

// Lazy load heavy components
const ToolGridsSection = React.lazy(() => import('./components/ToolGridsSection'));
const Footer = React.lazy(() => import('./components/Footer'));
const FAQSection = React.lazy(() => import('./components/FAQSection'));

const MAX_PDF_SIZE = 100 * 1024 * 1024; // 100 MB

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const universalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const file = files[0];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    try {
      await storeFile(file);
    } catch (error) {
      console.error("Failed to store file for handoff:", error);
      // Proceed anyway, user will just have to re-upload on the next page
    }

    if (isPdf) {
      if (file.size > MAX_PDF_SIZE) {
        alert("The PDF file is too large. Max 100MB.");
        return;
      }
      window.location.href = '/pdf-editor.html';
      return;
    }

    // Is Image
    window.location.href = '/image-editor.html';
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans antialiased overflow-x-hidden transition-colors duration-500 relative bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.9)_0%,_rgba(15,23,42,1)_35%,_rgba(2,6,23,1)_70%,_black_100%)]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/5 dark:bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <header className="glass-toolbar px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between z-[60] shrink-0">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
          <div className="w-7 h-7 md:w-8 md:h-8 bg-purple-500/90 rounded-xl flex items-center justify-center text-white font-black text-base md:text-lg group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/40">i</div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">ilovpdf</span>
            <span className="hidden sm:inline-block text-[7px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-[0.2em] mt-0.5">Free Online Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-4">
          <button aria-label="Toggle Theme" onClick={toggleTheme} className="p-2 text-slate-300 hover:text-purple-300 dark:text-slate-400 dark:hover:text-purple-300 rounded-lg transition-all">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative min-h-0 z-10">
        <div className="flex-1 overflow-y-auto relative scrollbar-hide bg-slate-50 dark:bg-[#030308]">
          <input
            type="file"
            className="hidden"
            ref={universalInputRef}
            onChange={handleFileUpload}
            accept="application/pdf,image/*"
          />

          <section className="px-6 py-12 md:py-24 text-center space-y-20 max-w-7xl mx-auto">
            <div className="space-y-16">
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-tight md:leading-none bg-gradient-to-br from-slate-900 via-slate-600 to-purple-600 dark:from-white dark:via-purple-100 dark:to-slate-500 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-2xl animate-gradient-x">FREE ONLINE PDF & IMAGE EDITOR</h1>

              <div
                onClick={() => universalInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && universalInputRef.current?.click()}
                className="mx-auto w-full max-w-lg neon-box neon-pdf p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer group transition-all duration-700 relative overflow-hidden"
                aria-label="Upload file"
                role="button"
                tabIndex={0}
              >
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Upload size={36} className="text-purple-500 mb-6 group-hover:-translate-y-2 transition-transform duration-700 drop-shadow-[0_0_15px_#5551FF]" />
                <span className="text-xl md:text-3xl font-black uppercase bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent tracking-tighter">Start Processing</span>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 opacity-60">100% Client-Side • PDF • JPG • PNG • DOCX • PPTX</p>
              </div>
            </div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin"></div></div>}>
              <ToolGridsSection />
            </Suspense>
          </section>

          <Suspense fallback={null}>
            <FAQSection />
            <Footer getToolPath={getToolPath} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
