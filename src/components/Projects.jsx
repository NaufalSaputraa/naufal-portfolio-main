import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const projects = [
    {
        id: 1,
        title: "Kotatsu-Redo",
        description: "Manga reader for Android.",
        fullDescription: "Kotatsu-Redo is a manga reader application for Android, allowing users to read and organize their favorite manga directly on their mobile device.",
        tech: ["Kotlin", "Android", "Jetpack Compose"],
        image: "/projects/kotatsu.png",
        link: "#",
        github: "https://github.com/NaufalSaputraa/Kotatsu-Redo",
        status: "Active"
    },
    {
        id: 2,
        title: "DuaSaku",
        description: "A personal finance manager built with Flutter to track expenses and manage budgets.",
        fullDescription: "DuaSaku is a comprehensive personal finance manager built with Flutter and Dart, utilizing Clean Architecture patterns to help users manage their money, budgets, and savings goals.",
        tech: ["Flutter", "Dart", "Clean Architecture", "State Management"],
        image: "/projects/duasaku.png",
        link: "#",
        github: "https://github.com/NaufalSaputraa/DuaSaku",
        status: "Active"
    }
];

const Projects = () => {
    const { isProMode } = useTheme();
    const [selectedId, setSelectedId] = useState(null);

    return (
        <section id="projects" className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
            <h2 className={`text-4xl font-semibold mb-12 flex items-center gap-3 ${isProMode ? 'text-text-dominant' : 'text-white'}`}>
                <Code2 className="text-primary" /> Selected Projects
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <motion.div
                        layoutId={project.id}
                        key={project.id}
                        onClick={() => setSelectedId(project.id)}
                        className={`group relative rounded-none overflow-hidden border cursor-pointer transition-colors duration-300 ${isProMode
                            ? 'bg-white border-surface-light hover:border-primary'
                            : 'bg-[#1c1c1e] border-white/5 hover:border-primary'
                            }`}
                        whileHover={{ y: -5 }}
                    >
                        {/* Image Preview */}
                        <div className="h-48 overflow-hidden relative">
                            <div className={`absolute inset-0 z-10 transition-all ${isProMode ? 'bg-black/5 group-hover:bg-transparent' : 'bg-black/20 group-hover:bg-transparent'}`} />
                            <motion.img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 z-20">
                                <span className="px-3 py-1 rounded-none text-xs font-semibold bg-black/75 backdrop-blur-md border border-white/10 text-white">
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        {/* Content Preview */}
                        <div className="p-6">
                            <motion.h3 className={`text-xl font-semibold mb-2 ${isProMode ? 'text-text-dominant' : 'text-white'}`}>{project.title}</motion.h3>
                            <p className={`text-sm line-clamp-2 ${isProMode ? 'text-text-secondary' : 'text-slate-400'}`}>{project.description}</p>
                            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                                Click to expand
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* POP-UP MODAL (AnimatePresence) */}
            <AnimatePresence>
                {selectedId && (
                    <>
                        {/* Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Modal Card */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                            <motion.div
                                layoutId={selectedId}
                                className={`w-full max-w-2xl rounded-none overflow-hidden shadow-2xl pointer-events-auto relative ${isProMode
                                    ? 'bg-white border border-slate-200'
                                    : 'bg-[#1c1c1e] border border-white/10'
                                    }`}
                            >
                                {/* Tombol Close */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors z-30"
                                >
                                    <X size={20} />
                                </button>

                                {(() => {
                                    const project = projects.find(p => p.id === selectedId);
                                    return (
                                        <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto">
                                            {/* Modal Image */}
                                            <div className="h-64 w-full relative shrink-0">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className={`absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t ${isProMode ? 'from-white to-transparent' : 'from-slate-900 to-transparent'}`} />
                                            </div>

                                            {/* Modal Content */}
                                            <div className="p-8">
                                                <motion.h3 className={`text-3xl font-semibold mb-2 ${isProMode ? 'text-text-dominant' : 'text-white'}`}>
                                                    {project.title}
                                                </motion.h3>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {project.tech.map((t, i) => (
                                                        <span key={i} className={`px-3 py-1 rounded-none text-xs border ${isProMode
                                                            ? 'bg-slate-100 text-text-secondary border-slate-200'
                                                            : 'bg-transparent text-slate-300 border-white/10'
                                                            }`}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>

                                                <p className={`leading-relaxed mb-8 text-base ${isProMode ? 'text-text-secondary' : 'text-slate-300'}`}>
                                                    {project.fullDescription || project.description}
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex gap-4 w-full">
                                                    {project.link !== '#' ? (
                                                        <>
                                                            <a href={project.link} target="_blank" className="flex-1 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all">
                                                                <ExternalLink size={18} /> Visit Site
                                                            </a>
                                                            <a href={project.github} target="_blank" className="flex-1 py-2.5 bg-transparent border-2 border-primary text-primary hover:bg-primary/5 font-medium rounded-full flex items-center justify-center gap-2 transition-colors">
                                                                <Github size={18} /> Source Code
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <a href={project.github} target="_blank" className="w-full py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all">
                                                            <Github size={18} /> Source Code
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;