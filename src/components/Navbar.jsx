import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { isProMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
    ];

    return (
        <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
        >
            <nav className={`rounded-full px-6 py-2.5 flex items-center justify-between gap-8 shadow-xl pointer-events-auto relative transition-all duration-500 ${isProMode ? 'bg-white/90 text-text-dominant border border-slate-200/80 shadow-slate-200/30 backdrop-blur-md' : 'glass-panel shadow-black/20'}`}>
                <a href="#" className="flex items-center gap-2 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform duration-300 ${isProMode ? 'bg-text-dominant text-white' : 'bg-primary text-white'}`}>
                        NS
                    </div>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${isProMode
                                    ? 'text-text-secondary hover:text-primary hover:bg-slate-100'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <a
                    href="#contact"
                    className={`hidden md:flex text-sm font-medium px-5 py-2 rounded-full transition-all items-center gap-2 ${isProMode
                            ? 'bg-primary text-white hover:bg-primary-hover active:bg-primary-press'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                        }`}
                >
                    <Mail size={18} />
                    <span>Contact</span>
                </a>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden p-1 rounded-full transition-colors ${isProMode
                            ? 'text-slate-900 hover:bg-slate-100'
                            : 'text-white hover:bg-white/10'
                        }`}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`absolute top-full right-0 mt-4 w-48 p-2 rounded-2xl flex flex-col gap-1 md:hidden overflow-hidden ${isProMode
                                    ? 'bg-white border border-slate-200 shadow-xl'
                                    : 'glass-panel'
                                }`}
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors block ${isProMode
                                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${isProMode
                                        ? 'text-text-dominant hover:text-primary hover:bg-slate-100'
                                        : 'text-primary hover:text-white hover:bg-primary/20'
                                    }`}
                            >
                                <Mail size={16} />
                                Contact
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.div>
    );
};

export default Navbar;
