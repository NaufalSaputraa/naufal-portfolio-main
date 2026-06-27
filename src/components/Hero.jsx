import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import MagneticButton from "./ui/MagneticButton";
import InteractiveTerminal from './InteractiveTerminal';
import ProfessionalBio from './ui/ProfessionalBio';
import { useTheme } from '../context/ThemeContext';

const Hero = ({ triggerHack }) => {
    const { isProMode } = useTheme();

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = {
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true,
            },
            modes: {
                grab: { distance: 150, links: { opacity: 0.5 } },
            },
        },
        particles: {
            color: { value: ["#0071E3", "#06b6d4", "#10b981"] },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { density: { enable: true, area: 800 }, value: 60 },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    };

    return (
        <section id="about" className="min-h-screen flex flex-col justify-center items-center relative pt-32 pb-20 overflow-hidden text-center transition-colors duration-500">
            {/* Particles Background (Only in Hacker Mode) */}
            {!isProMode && (
                <div className="absolute inset-0 z-0">
                    <Particles
                        id="tsparticles"
                        init={particlesInit}
                        options={particlesOptions}
                        className="w-full h-full"
                    />
                </div>
            )}

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">

                {/* 1. TEXT SECTION: Adaptive Typography */}
                <div className="z-20 text-center w-full max-w-screen-xl mx-auto mb-10">

                    {/* Badge Status (Hacker Mode Only) */}
                    {!isProMode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider mb-6 backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            SYSTEM ONLINE
                        </motion.div>
                    )}

                    {/* Intro Text */}
                    <motion.h2
                        layout
                        className={`font-medium mb-4 transition-all duration-500 ${isProMode
                            ? 'text-slate-500 text-lg tracking-normal font-sans'
                            : 'text-slate-300 text-xl tracking-widest font-mono'
                            }`}
                    >
                        {isProMode ? "Hello, I'm" : "Hi, I'm"}
                    </motion.h2>

                    {/* NAME: Drastic Style Change */}
                    <motion.h1
                        layout
                        className={`transition-all duration-500 mb-6 whitespace-nowrap ${isProMode
                            ? 'text-5xl md:text-7xl text-slate-900 font-bold tracking-tight font-sans' // HR Style: Bold (not Black)
                            : 'text-5xl md:text-7xl lg:text-8xl text-white font-black tracking-tighter scale-y-110 font-display' // Cyber Style: Black
                            }`}
                    >
                        {isProMode ? (
                            "Naufal Saputra"
                        ) : (
                            <span className="glitch-wrapper">
                                <span className="glitch text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" data-text="Naufal Saputra">
                                    Naufal Saputra
                                </span>
                            </span>
                        )}
                    </motion.h1>

                    {/* Subtitle (Hacker Mode Only - HR Info is in Bio Card) */}
                    {!isProMode && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-400 max-w-xl mx-auto text-lg mb-8"
                        >
                            Informatics Engineering Student. <span className="text-cyan-400">Cyber Security</span> Enthusiast.
                        </motion.p>
                    )}
                </div>

                {/* 2. INTERACTIVE AREA: Swap Terminal vs Bio Card */}
                <div className="w-full max-w-3xl z-30 transition-all duration-500">
                    {isProMode ? (
                        // TAMPILAN HR: Kartu Bio Profesional
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="transform hover:-translate-y-1 transition-transform duration-300"
                        >
                            <ProfessionalBio />
                        </motion.div>
                    ) : (
                        // TAMPILAN CYBER: Terminal & Tombol Hacker
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <InteractiveTerminal onHack={triggerHack} />

                            {/* Hacker Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <MagneticButton className="group relative flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <a href="#projects" className="relative flex items-center gap-2 z-10">
                                        <span className="text-cyan-400 group-hover:text-white transition-colors">Initialize Projects</span>
                                        <ArrowRight size={18} className="text-cyan-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                    </a>
                                </MagneticButton>

                                <div className="flex gap-4">
                                    <MagneticButton>
                                        <a href="https://github.com/NaufalSaputraa" target="_blank" className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 hover:border-white/30">
                                            <Github size={24} />
                                        </a>
                                    </MagneticButton>
                                    <MagneticButton>
                                        <a href="https://linkedin.com" target="_blank" className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 hover:border-white/30">
                                            <Linkedin size={24} />
                                        </a>
                                    </MagneticButton>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
