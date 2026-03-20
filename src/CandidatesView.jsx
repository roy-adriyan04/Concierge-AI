import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CandidatesView = ({ selectedDate, selectedTime, candidate, onConfirm }) => {
    const [selectedOptionId, setSelectedOptionId] = useState(0); 
    const [isScheduled, setIsScheduled] = useState(false);

    // Dynamic Date Calculation Logic
    const baseDate = selectedDate ? new Date(selectedDate) : new Date('2026-03-23');
    
    // Calculate Monday of that week for Heatmap
    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay() || 7;
        if (day !== 1) date.setHours(-24 * (day - 1));
        return date;
    };

    const monday = getMonday(baseDate);
    const heatmapDays = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
            label: d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase() + ' ' + d.getDate(),
            full: d
        };
    });

    // Helper to format option dates
    const formatOptionDate = (d) => d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const optDate1 = new Date(baseDate);
    const optDate2 = new Date(baseDate); optDate2.setDate(baseDate.getDate() + 1);
    const optDate3 = new Date(baseDate); optDate3.setDate(baseDate.getDate() - 2);

    const timeDisplay = selectedTime || '2:00 PM – 3:30 PM (90m)';

    const options = [
        {
            id: 0,
            dateStr: formatOptionDate(optDate1),
            timeStr: timeDisplay,
            confidence: 98,
            recommended: true,
            reasoning: "This slot aligns perfectly with Marcus's open afternoon and Elena's peak performance window. Zero conflicts across all 3 panel members.",
            dayIndex: optDate1.getDay() === 0 ? 6 : optDate1.getDay() - 1 // Mon=0
        },
        {
            id: 1,
            dateStr: formatOptionDate(optDate2),
            timeStr: '10:30 AM – 12:00 PM',
            confidence: 82,
            recommended: false,
            reasoning: "Strong candidate availability, but Sarah Jenkins would need to shift a 15-minute sync. Ideal for team energy levels.",
            dayIndex: optDate2.getDay() === 0 ? 6 : optDate2.getDay() - 1
        },
        {
            id: 2,
            dateStr: formatOptionDate(optDate3),
            timeStr: '4:00 PM – 5:30 PM',
            confidence: 65,
            recommended: false,
            reasoning: "Elena's last-choice window. Marcus will be joining late due to previous engagement. High risk of rescheduling.",
            dayIndex: optDate3.getDay() === 0 ? 6 : optDate3.getDay() - 1
        }
    ];

    const currentOption = options.find(o => o.id === selectedOptionId);

    const handleConfirm = () => {
        setIsScheduled(true);
        if (onConfirm) onConfirm(currentOption.dateStr, currentOption.timeStr);
    };

    return (
        <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto bg-surface text-on-surface scroll-smooth pb-32">
            
            {/* Top Search & Profile Navigation (Mocking the top bar from image) */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex-1 max-w-xl relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
                    <input type="text" placeholder="Search candidates or slots..." className="w-full bg-surface-container-highest border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium" />
                </div>
                <div className="flex items-center gap-6">
                    <button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold leading-tight">Alex Rivera</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-80">Senior Recruiter</p>
                        </div>
                        <img src="https://i.pravatar.cc/150?u=alex" alt="Alex" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    </div>
                </div>
            </div>

            {/* Header Profile Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="flex gap-6 items-center">
                    <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=elena" alt="Elena Rodriguez" className="w-[100px] h-[100px] rounded-3xl object-cover ring-1 ring-white/10 shadow-xl" />
                        <div className="absolute -bottom-2 -right-2 bg-surface-container-highest rounded-full p-1 border-2 border-surface">
                            <span className="material-symbols-outlined text-sm text-primary">verified</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">{candidate ? candidate.name : "Elena Rodriguez"}</h1>
                        <p className="text-on-surface-variant font-medium text-lg mb-4">{candidate ? candidate.role : "Senior Product Designer"}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-surface-container-highest text-on-surface px-4 py-2 rounded-full border border-white/5">Stage: Technical Interview</span>
                            <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">schedule</span> Wait time: 2 days</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-surface-container-high hover:bg-surface-bright rounded-2xl text-sm font-bold border border-white/5 shadow-sm transition-all focus:ring-2 focus:ring-primary/30 outline-none">View Portfolio</button>
                    <button className="px-6 py-3 bg-surface-container-high hover:bg-surface-bright rounded-2xl text-sm font-bold border border-white/5 shadow-sm transition-all focus:ring-2 focus:ring-primary/30 outline-none">Candidate Notes</button>
                </div>
            </header>

            {/* Heatmap & Conflict Report Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                {/* Heatmap */}
                <div className="xl:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 border border-white/5 shadow-lg relative overflow-hidden">
                    {/* Background glow for primary interaction */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-black tracking-tight">Availability Heatmap</h3>
                        <div className="flex gap-6 text-[10px] uppercase font-black tracking-widest text-on-surface-variant">
                            <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-primary/30 border border-primary/50 rounded-sm"></div> Candidate</span>
                            <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-surface-container-highest border border-white/10 rounded-sm"></div> Interviewers</span>
                        </div>
                    </div>
                    
                    {/* The Grid */}
                    <div className="grid grid-cols-5 gap-4 relative z-10 h-[300px]">
                        {heatmapDays.map((dayObj, idx) => {
                            const day = dayObj.label;
                            const isTargeted = currentOption.dayIndex === idx;
                            return (
                                <div key={day} className="flex flex-col items-center h-full">
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-colors", isTargeted ? "text-primary" : "text-on-surface-variant opacity-70")}>{day}</span>
                                    <div className={cn(
                                        "w-full flex-1 rounded-2xl flex flex-col pt-4 overflow-hidden relative transition-all duration-500",
                                        isTargeted 
                                        ? "ring-2 ring-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]" 
                                        : "bg-surface-container-lowest border border-white/5"
                                    )}>
                                        
                                        {/* Dynamic visualization blocks to match design */}
                                        {idx === 0 && ( /* MON */
                                            <>
                                                <div className="absolute top-8 w-full h-16 bg-surface-container-highest/60 border-y border-white/5"></div>
                                                <div className="absolute top-[40%] w-full h-24 bg-surface-container-highest/60 border-y border-white/5"></div>
                                            </>
                                        )}
                                        
                                        {idx === 1 && ( /* TUE */
                                            <div className="absolute top-12 w-full h-32 bg-surface-container-highest/60 border-y border-white/5"></div>
                                        )}

                                        {idx === 2 && ( /* WED */
                                            <div className="m-auto opacity-10 flex flex-col items-center"><span className="material-symbols-outlined text-3xl">event_busy</span></div>
                                        )}

                                        {idx === 3 && ( /* THU (Target) */
                                            <>
                                                <div className="absolute top-[10%] w-full h-[80%] bg-surface-container-lowest border-y border-white/5"></div>
                                                <div className="absolute top-[25%] w-full h-[35%] bg-primary/20 backdrop-blur-sm border-y border-primary/50 flex flex-col justify-center items-center overflow-hidden z-10">
                                                    
                                                    {isScheduled && isTargeted ? (
                                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center p-2 text-center w-full bg-primary h-full justify-center">
                                                            <div className="flex -space-x-2 mb-1.5">
                                                                <img src="https://i.pravatar.cc/150?u=marcus" className="w-5 h-5 rounded-full border border-primary shadow-sm" />
                                                                <img src="https://i.pravatar.cc/150?u=sarah" className="w-5 h-5 rounded-full border border-primary shadow-sm" />
                                                                <img src="https://i.pravatar.cc/150?u=david" className="w-5 h-5 rounded-full border border-primary shadow-sm" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-on-primary uppercase tracking-widest leading-none drop-shadow-md">Panel Confirmed</span>
                                                        </motion.div>
                                                    ) : (
                                                        <div className="absolute w-full h-full bg-primary/20 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {idx === 4 && ( /* FRI */
                                            <>
                                                <div className="absolute top-16 w-full h-20 bg-surface-container-highest/60 border-y border-white/5"></div>
                                                <div className="absolute top-[60%] w-full h-24 bg-surface-container-highest/60 border-y border-white/5"></div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Conflict Report */}
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-white/5 shadow-lg flex flex-col">
                    <h3 className="text-xl font-black tracking-tight mb-8">Conflict Report</h3>
                    <div className="space-y-8 flex-1">
                        
                        <div className="flex gap-4">
                            <img src="https://i.pravatar.cc/150?u=marcus" className="w-12 h-12 rounded-full object-cover ring-2 ring-error/20" />
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold leading-tight">Marcus Chen <br/><span className="text-on-surface-variant font-medium text-xs">(Hiring Manager)</span></p>
                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase bg-error/20 text-error px-2 py-1 rounded">Critical</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Hard conflict on Monday/Tuesday during Board Review. Only available Thu PM.</p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        <div className="flex gap-4">
                            <img src="https://i.pravatar.cc/150?u=sarah" className="w-12 h-12 rounded-full object-cover ring-2 ring-on-surface-variant/20 grayscale" />
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold leading-tight">Sarah Jenkins <br/><span className="text-on-surface-variant font-medium text-xs">(Peer)</span></p>
                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase bg-on-surface-variant/20 text-on-surface-variant px-2 py-1 rounded">Minor</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">Flexible lunchtime conflict on Friday. Preferred time: 10:00 AM.</p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        <div className="flex gap-4">
                            <img src="https://i.pravatar.cc/150?u=david" className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-container-highest grayscale" />
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold leading-tight">David Wu <br/><span className="text-on-surface-variant font-medium text-xs">(CTO)</span></p>
                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase bg-surface-container-high text-on-surface px-2 py-1 rounded">Flexible</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">No direct conflicts, but prefers morning slots to match UTC+1 team.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Curated Scheduling Options */}
            <div className="mb-20 relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2"><span className="material-symbols-outlined text-primary">auto_awesome</span> Curated Scheduling Options</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {options.map((opt) => {
                        const isSelected = selectedOptionId === opt.id;
                        return (
                            <div 
                                key={opt.id} 
                                onClick={() => { setSelectedOptionId(opt.id); setIsScheduled(false); }}
                                className={cn(
                                    "p-8 rounded-[2rem] cursor-pointer transition-all duration-300 relative overflow-hidden group border",
                                    isSelected 
                                    ? "bg-surface-container-lowest border-primary shadow-[0_0_40px_rgba(var(--color-primary),0.15)] ring-1 ring-primary/30 scale-[1.02] z-10" 
                                    : "bg-surface-container-lowest border-white/5 hover:border-white/10 opacity-60 hover:opacity-100 hover:scale-[1.01]"
                                )}
                            >
                                {isSelected && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                                
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-on-surface-variant/80">Option 0{opt.id + 1}</span>
                                    {opt.recommended && (
                                        <span className="bg-primary/20 text-primary text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-primary/30">Recommended</span>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h4 className="text-3xl font-black italic tracking-tighter mb-2">{opt.dateStr}</h4>
                                        <p className="text-sm font-medium text-on-surface-variant">{opt.timeStr}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-black leading-none tracking-tighter">{opt.confidence}<span className="text-xl">%</span></p>
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-on-surface-variant mt-2">Confidence</p>
                                    </div>
                                </div>
                                
                                <p className="text-xs italic font-medium text-on-surface-variant leading-relaxed">"{opt.reasoning}"</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Action Bar */}
            <AnimatePresence>
                <motion.div 
                    initial={{ y: 100, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="fixed bottom-8 left-0 w-full px-8 pointer-events-none z-50 flex justify-center lg:ml-[280px] lg:w-[calc(100%-280px)]"
                >
                    <div className="w-full max-w-5xl bg-surface-container-lowest/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 pl-6 flex items-center justify-between shadow-2xl pointer-events-auto shadow-black/50">
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                <img src="https://i.pravatar.cc/150?u=marcus" className="w-10 h-10 rounded-full border-2 border-surface object-cover relative z-30" />
                                <img src="https://i.pravatar.cc/150?u=sarah" className="w-10 h-10 rounded-full border-2 border-surface object-cover relative z-20 grayscale" />
                                <img src="https://i.pravatar.cc/150?u=david" className="w-10 h-10 rounded-full border-2 border-surface object-cover relative z-10 grayscale" />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-tight">3 Panel Members Notified</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant mt-1">Ready to Confirm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <button className="flex items-center gap-2 text-xs font-bold px-4 py-2 hover:bg-white/5 rounded-xl transition-all text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined text-lg">history</span> Re-scan Fallback
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold px-5 py-3 bg-surface-container-high hover:bg-surface-bright rounded-xl transition-all border border-white/5 shadow-sm">
                                <span className="material-symbols-outlined text-lg">mail</span> Draft Email
                            </button>
                            <button 
                                onClick={handleConfirm}
                                disabled={isScheduled}
                                className={cn(
                                    "px-8 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl disabled:opacity-80 disabled:cursor-default",
                                    isScheduled 
                                    ? "bg-tertiary text-on-tertiary shadow-tertiary/20" 
                                    : "bg-primary text-on-primary hover:bg-primary-light shadow-primary/20 hover:scale-[1.02]"
                                )}
                            >
                                {isScheduled ? 'Scheduled!' : `Confirm Slot #${currentOption.id + 1}`} 
                                {isScheduled 
                                    ? <span className="material-symbols-outlined text-lg">check_circle</span> 
                                    : <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                }
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div >
    );
};
