import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PipelinesView = ({ applicants, onSelectCandidate }) => {
    // Current date logic (March 2026)
    const currentMonth = "March";
    const currentYear = "2026";

    const columns = [
        { id: 'new', title: 'NEW APPLICATIONS', count: applicants.filter(a => a.status === 'NEW APPLICATIONS').length },
        { id: 'screening', title: 'SCREENING', count: applicants.filter(a => a.status === 'SCREENING').length },
        { id: 'scheduled', title: 'INTERVIEW SCHEDULED', count: applicants.filter(a => a.status === 'INTERVIEW SCHEDULED').length }
    ];

    return (
        <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto bg-background text-on-surface">
            
            {/* Header Area */}
            <div className="flex justify-between items-start mb-12">
                <div>
                   <h1 className="text-2xl font-black font-headline tracking-tighter uppercase text-primary mb-2">Concierge AI</h1>
                   <div className="flex flex-col">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1 opacity-60">RECRUITMENT CYCLE</p>
                       <h2 className="text-5xl font-black font-headline tracking-tighter leading-none">Candidate Pipeline</h2>
                   </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                    {/* Filters */}
                    <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-2xl border border-white/5 shadow-lg">
                        <select className="bg-transparent border-0 text-[10px] font-black uppercase tracking-widest px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer outline-none appearance-none">
                            <option>Product Designers</option>
                            <option>Frontend Engineers</option>
                        </select>
                        <div className="w-px h-6 bg-white/5 mx-1"></div>
                        <select className="bg-transparent border-0 text-[10px] font-black uppercase tracking-widest px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer outline-none appearance-none">
                            <option>All Recruiters</option>
                            <option>Alex Rivera</option>
                        </select>
                        <div className="w-px h-6 bg-white/5 mx-1"></div>
                        <div className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">This Month</span>
                        </div>
                    </div>
                    <button className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-2xl border border-white/5 hover:bg-surface-container-high transition-colors shadow-lg">
                        <span className="material-symbols-outlined text-xl">tune</span>
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start flex-1 min-h-[600px]">
                {columns.map(col => (
                    <div key={col.id} className="flex flex-col gap-8 h-full">
                        <div className="flex items-center gap-4 px-2">
                           <div className={cn("w-2 h-2 rounded-full", col.id === 'new' ? 'bg-primary' : col.id === 'screening' ? 'bg-tertiary' : 'bg-primary')}></div>
                           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">{col.title}</h3>
                           <span className="text-[10px] font-black px-2.5 py-1 bg-surface-container-low rounded-lg border border-white/5 opacity-40">{col.count}</span>
                        </div>

                        <div className="flex flex-col gap-6">
                            {applicants.filter(a => (col.id === 'new' && a.status === 'NEW APPLICATIONS') || (col.id === 'screening' && a.status === 'SCREENING') || (col.id === 'scheduled' && a.status === 'INTERVIEW SCHEDULED')).length > 0 ? (
                                applicants.filter(a => (col.id === 'new' && a.status === 'NEW APPLICATIONS') || (col.id === 'screening' && a.status === 'SCREENING') || (col.id === 'scheduled' && a.status === 'INTERVIEW SCHEDULED')).map(applicant => (
                                    <ApplicantCard key={applicant.id} applicant={applicant} onClick={() => onSelectCandidate(applicant)} />
                                ))
                            ) : col.id === 'scheduled' ? (
                                <div className="p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-on-surface-variant/20 gap-4 group hover:border-primary/10 transition-colors cursor-default">
                                    <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">event_available</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest">No candidates scheduled yet</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ApplicantCard = ({ applicant, onClick }) => (
    <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        onClick={onClick}
        className="bg-surface-container-low p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group flex flex-col gap-6 relative overflow-hidden"
    >
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-4 items-center">
                <img src={`https://i.pravatar.cc/150?u=${applicant.id}`} alt={applicant.name} className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/10" />
                <div>
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{applicant.name}</h4>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-70">{applicant.role}</p>
                </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-xl border border-white/5 opacity-40 hover:opacity-100 transition-all">
                <span className="material-symbols-outlined text-xl">more_horiz</span>
            </button>
        </div>

        <div className="flex gap-2">
            <div className="bg-surface-container-high px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Match:</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">{applicant.match}%</span>
            </div>
            <div className="bg-surface-container-high px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                {applicant.roundCount && <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Round {applicant.roundCount}</span>}
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Applied: {applicant.applied.split(',')[0]}</span>
            </div>
        </div>

        {applicant.status === 'INTERVIEW SCHEDULED' && (
            <div className="bg-surface-container-highest/50 border border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">INTERVIEW DATE</p>
                <h5 className="text-2xl font-black tracking-tighter leading-none">{applicant.interviewDate || 'March 24, 2026'}</h5>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80 mt-1">{applicant.round} • {applicant.interviewTime?.split('(')[0] || '14:00'}</p>
            </div>
        )}

        <div className="h-px w-full bg-white/5"></div>

        <div className="flex justify-between items-center">
            <div>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-on-surface-variant opacity-50 mb-1.5">ROUND: {applicant.round}</p>
                <span className={cn(
                    "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.15em]",
                    applicant.roundStatus === 'PENDING' ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary/20 text-primary'
                )}>
                    {applicant.roundStatus}
                </span>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">AI Confidence: {applicant.confidence}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-30 group-hover:translate-x-1 transition-transform">send</span>
            </div>
        </div>
    </motion.div>
);
