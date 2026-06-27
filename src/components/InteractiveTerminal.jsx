import React, { useState, useEffect, useRef } from 'react';

// --- BAGIAN 1: KOMPONEN TYPEWRITER (VERSI REVISI - LEBIH ROBUST) ---
const TypewriterText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    // Gunakan ref untuk tracking index agar tidak depend pada re-render state
    const indexRef = useRef(0);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        // Reset state saat 'text' prop berubah
        setDisplayedText('');
        indexRef.current = 0;
        hasCompletedRef.current = false;

        const timer = setInterval(() => {
            if (indexRef.current < text.length) {
                // Ambil karakter saat ini dengan aman
                const char = text.charAt(indexRef.current);
                setDisplayedText((prev) => prev + char);
                indexRef.current++;
            } else {
                clearInterval(timer);
                if (!hasCompletedRef.current && onComplete) {
                    hasCompletedRef.current = true;
                    onComplete();
                }
            }
        }, 30); // Sedikit diperlambat agar lebih stabil (20ms -> 30ms)

        return () => clearInterval(timer);
    }, [text]);

    // Force render full text jika ada glitch (fallback)
    return <span>{displayedText}</span>;
};

// --- BAGIAN 2: KOMPONEN UTAMA ---
const InteractiveTerminal = ({ onHack }) => {
    const [input, setInput] = useState('');
    // State awal history
    const [history, setHistory] = useState([
        {
            type: 'output',
            content: 'Welcome to My Page. Type "help" to see available commands.',
            isTyping: true
        }
    ]);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let response = '';

        if (trimmedCmd === 'hack') {
            if (typeof onHack === 'function') {
                console.log("✅ Execute Hack");
            } else {
                console.error("❌ Prop onHack missing");
            }
        }

        switch (trimmedCmd) {
            case 'help':
                response = `Available commands:
  about    - Who is Naufal?
  projects - View portfolio works
  contact  - Get contact info
  clear    - Clear terminal
  whoami   - Current user
  hack     - ???`;
                break;
            case 'whoami':
                response = 'guest@naufal.dev';
                break;
            case 'hack':
                response = 'Initializing HACKER_MODE protocol... Access Granted.';
                if (onHack) {
                    setTimeout(() => onHack(), 1500);
                }
                break;
            case 'about':
                response = 'Naufal Saputra. Informatics Student Semester 4 @ UNNES. Cyber Security enthusiast.';
                break;
            case 'contact':
                response = 'Email: naufalnamikaze175@gmail.com\nLinkedIn: https://www.linkedin.com/in/naufalanwarsaputra\nGitHub: github.com/NaufalSaputraa\nInstagram: https://www.instagram.com/naansa_';
                break;
            case 'projects':
                response = 'Check out the "Selected Projects" section below to see my work on DuaSaku';
                break;
            case 'clear':
                setHistory([]);
                return;
            default:
                response = `command not found: ${trimmedCmd}`;
        }

        setHistory(prev => [...prev, { type: 'input', content: trimmedCmd }]);

        if (trimmedCmd !== 'clear') {
            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'output', content: response, isTyping: true }]);
            }, 100);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        const element = terminalRef.current;
        if (!element) return;
        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.scrollTop += e.deltaY;
        };
        element.addEventListener('wheel', handleWheel, { passive: false });
        return () => element.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div
            className="w-full max-w-2xl mx-auto bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl font-mono text-sm relative z-20 text-left"
            onClick={() => inputRef.current?.focus()}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
        .cyber-scrollbar::-webkit-scrollbar { width: 6px; }
        .cyber-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .cyber-scrollbar::-webkit-scrollbar-thumb { background-color: #059669; border-radius: 20px; }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #10b981; }
        .cyber-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #059669 #0f172a;
        }
      `}} />

            <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 text-slate-500 text-xs select-none">guest@naufal:~</div>
            </div>

            <div
                ref={terminalRef}
                className="cyber-scrollbar p-4 h-80 overflow-y-auto text-left"
            >
                {history.map((line, i) => (
                    <div key={i} className={`mb-1 ${line.type === 'input' ? 'text-slate-400' : 'text-emerald-400 whitespace-pre-wrap'}`}>
                        {line.type === 'input' ? '> ' : ''}
                        {line.type === 'output' && line.isTyping ? (
                            <TypewriterText text={line.content} />
                        ) : (
                            line.content
                        )}
                    </div>
                ))}

                <div className="flex items-center text-slate-100">
                    <span className="text-emerald-500 mr-2">guest@naufal:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-600"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};

export default InteractiveTerminal;
