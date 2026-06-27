import React from 'react';
import { FileText, Mail, Linkedin, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfessionalBio = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto bg-white dark:bg-[#1c1c1e]/60 rounded-none border border-slate-200/50 dark:border-white/5 border-l-4 border-l-primary overflow-hidden text-left p-8 flex flex-col md:flex-row gap-8 items-center md:items-start"
        >

            {/* Kolom Kiri: Foto/Avatar (Placeholder Profesional) */}
            <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#272729] shadow-md relative group">
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10" />
                    <img
                        src="https://github.com/NaufalSaputraa.png"
                        alt="Naufal Saputra"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Kolom Kanan: Teks Profesional */}
            <div className="flex-1 space-y-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">About Me</span>
                    <h3 className="text-3xl font-semibold text-text-dominant dark:text-white tracking-tight leading-tight">Informatics Engineering Student</h3>
                    <p className="text-text-tertiary dark:text-slate-400 font-medium flex items-center gap-2 text-sm">
                        Universitas Negeri Semarang
                    </p>
                </div>

                <p className="text-text-secondary dark:text-slate-300 leading-relaxed text-sm md:text-base">
                    A fast learner and adaptable Informatics student who thrives on <strong>solving complex problems</strong>. 
            I am passionate about <strong>Cyber Security</strong> and never afraid to take on new technical challenges. 
            Outside of coding, I enjoy strategy games which sharpen my analytical thinking and decision-making skills.
                </p>

                {/* Tombol Aksi HR */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <a href="mailto:naufalnamikaze175@gmail.com" className="px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover active:bg-primary-press transition-all flex items-center gap-2 text-sm font-medium">
                        <Mail size={16} /> Email Me
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfessionalBio;
