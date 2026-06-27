import { motion } from 'framer-motion';
import {
    SiFlutter, SiFirebase, SiReact, SiCloudflare, SiPython,
    SiMysql, SiNextdotjs, SiSupabase, SiTailwindcss, SiVercel, SiGit,
    SiKotlin, SiAndroid, SiTypescript, SiExpo, SiRust
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { useState, useEffect, lazy, Suspense } from 'react';
import { useTheme } from '../context/ThemeContext';
const FloatingShapes = lazy(() => import('./3d/FloatingShapes'));

const Skills = () => {
    const { isProMode } = useTheme();
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Hydration safe check for desktop
        setIsDesktop(window.innerWidth > 768);

        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const skills = [
        { name: 'Flutter', color: 'text-cyan-400', icon: SiFlutter },
        { name: 'React Native', color: 'text-cyan-500', icon: SiReact },
        { name: 'Expo', color: 'text-white', icon: SiExpo },
        { name: 'Kotlin', color: 'text-purple-500', icon: SiKotlin },
        { name: 'Android', color: 'text-green-500', icon: SiAndroid },
        { name: 'React', color: 'text-cyan-300', icon: SiReact },
        { name: 'Next.js', color: 'text-white', icon: SiNextdotjs },
        { name: 'TypeScript', color: 'text-blue-400', icon: SiTypescript },
        { name: 'Java', color: 'text-red-500', icon: FaJava },
        { name: 'Rust', color: 'text-orange-600', icon: SiRust },
        { name: 'Tailwind', color: 'text-teal-400', icon: SiTailwindcss },
        { name: 'Firebase', color: 'text-yellow-500', icon: SiFirebase },
        { name: 'Supabase', color: 'text-emerald-400', icon: SiSupabase },
        { name: 'SQL', color: 'text-blue-500', icon: SiMysql },
        { name: 'Python', color: 'text-yellow-300', icon: SiPython },
        { name: 'Cloudflare', color: 'text-orange-500', icon: SiCloudflare },
        { name: 'Vercel', color: 'text-white', icon: SiVercel },
        { name: 'Git', color: 'text-orange-600', icon: SiGit }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section id="skills" className="mb-32 scroll-mt-32 relative">
            {/* 3D Background - Hacker Mode & Desktop Only */}
            {!isProMode && isDesktop && (
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] z-0 opacity-50 pointer-events-none">
                    <Suspense fallback={null}>
                        <FloatingShapes />
                    </Suspense>
                </div>
            )}

            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`text-xl font-semibold mb-8 flex items-center gap-3 relative z-10 ${isProMode ? 'text-text-dominant' : 'text-slate-200'}`}
            >
                <span className={`w-8 h-[1px] ${isProMode ? 'bg-slate-300' : 'bg-slate-700'}`}></span>
                Tech Stack & Tools
            </motion.h2>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3 relative z-10"
            >
                {skills.map((skill) => (
                    <motion.div
                        key={skill.name}
                        variants={item}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-none transition-colors duration-300 cursor-default border ${isProMode
                            ? 'bg-transparent text-text-secondary border-slate-200/80 hover:border-primary hover:text-text-dominant'
                            : 'bg-transparent text-slate-400 border-white/10 hover:border-primary hover:text-white'
                            }`}
                    >
                        <div className={`w-5 h-5 flex items-center justify-center ${isProMode ? 'text-text-secondary' : skill.color}`}>
                            <skill.icon size={18} />
                        </div>
                        <span className="text-sm font-medium">{skill.name}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Skills;
