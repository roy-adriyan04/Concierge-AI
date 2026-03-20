import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { createMeetEvent, sendInviteEmail } from './logic/GoogleIntegration';
import { AvailabilityParser } from './logic/AvailabilityParser';
import { SchedulerEngine } from './logic/SchedulerEngine';
import { CandidatesView } from './CandidatesView';
import { PipelinesView } from './PipelinesView';
import { SettingsView } from './SettingsView';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ALL_INTERVIEWERS = [
    { name: 'Marcus Chen', role: 'Hiring Manager', avail: 'Mon–Fri 9 AM–6 PM' },
    { name: 'Sarah Jenkins', role: 'Staff Designer', avail: 'Tue–Thu 10 AM–2 PM' },
    { name: 'David Wu', role: 'CTO', avail: 'Wed-Fri 1 PM–5 PM' }
];

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const App = () => {
    const [page, setPage] = useState('login'); // 'login', 'dashboard', 'detail'
    const [googleToken, setGoogleToken] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [applicants, setApplicants] = useState([
        { 
            id: 1, 
            name: 'Elena Rostova', 
            role: 'Sr. Product Designer', 
            match: 98, 
            applied: 'March 10, 2026', 
            relativeApplied: '2d ago',
            status: 'NEW APPLICATIONS',
            round: 'SCREENING',
            roundStatus: 'PENDING',
            confidence: 'HIGH'
        },
        { 
            id: 2, 
            name: 'Marcus Thorne', 
            role: 'UX Strategist', 
            match: 84, 
            applied: 'March 11, 2026', 
            relativeApplied: '5h ago',
            status: 'NEW APPLICATIONS',
            round: 'INITIAL REVIEW',
            roundStatus: 'IN PROGRESS',
            confidence: 'MED'
        },
        { 
            id: 3, 
            name: 'Julian Voss', 
            role: 'Design Technologist', 
            match: 92, 
            applied: 'March 05, 2026', 
            relativeApplied: '6d ago',
            status: 'SCREENING',
            round: 'SCREENING',
            roundCount: '1/3',
            roundStatus: 'IN PROGRESS',
            confidence: 'HIGH'
        }
    ]);
    const [selectedDate, setSelectedDate] = useState('2026-03-23');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [results, setResults] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        const dayName = selectedDate ? new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(selectedDate)) : '';
        const candString = dayName && selectedTime ? `${dayName} ${selectedTime.replace(' - ', '-')}` : '';
        const candAvail = candString ? AvailabilityParser.parseString(candString) : [];
        const intAvails = ALL_INTERVIEWERS.map(l => AvailabilityParser.parseString(l.avail));
        
        const slots = SchedulerEngine.findCommonSlots(candAvail, intAvails, duration);
        setTimeout(() => {
            setResults(slots);
            setIsAnalyzing(false);
        }, 800);
    };

    const handleConfirmSchedule = (candId, date, time) => {
        setApplicants(prev => prev.map(a => a.id === candId ? { ...a, status: 'INTERVIEW SCHEDULED', roundStatus: 'SCHEDULED', interviewDate: date, interviewTime: time } : a));
    };

    useEffect(() => {
        if (page === 'dashboard' && selectedDate && selectedTime) handleAnalyze();
    }, [page, selectedDate, selectedTime]);

    if (page === 'login') return <LoginPage onLogin={(token) => { setGoogleToken(token); setPage('pipelines'); }} />;

    return (
        <div className="flex bg-background min-h-screen font-body text-on-surface">
            {/* Side Navigation */}
            <aside className="w-64 fixed h-full bg-surface-container-low p-6 flex flex-col gap-6 z-50 border-r border-white/5">
                <div onClick={() => setPage('dashboard')} className="cursor-pointer group">
                   <h1 className="text-xl font-extrabold text-primary font-headline tracking-tighter uppercase group-hover:drop-shadow-[0_0_10px_rgba(192,193,255,0.3)] transition-all">Concierge AI</h1>
                   <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] mt-1">The Digital Curator</p>
                </div>
                
                <nav className="flex flex-col gap-1 flex-1">
                    <NavItem icon="dashboard" label="Dashboard" active={page === 'dashboard'} onClick={() => setPage('dashboard')} />
                    <NavItem icon="group" label="Candidates" active={page === 'candidates'} onClick={() => setPage('candidates')} />
                    <NavItem icon="account_tree" label="Pipelines" active={page === 'pipelines'} onClick={() => setPage('pipelines')} />
                    <NavItem icon="settings" label="Settings" active={page === 'settings'} onClick={() => setPage('settings')} />
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <NavItem icon="help" label="Help Center" active={false} />
                    <NavItem icon="logout" label="Logout" active={false} />
                    
                    {page !== 'settings' && (
                        <button 
                            onClick={() => setPage('dashboard')}
                            className="w-full primary-gradient py-4 rounded-2xl text-on-primary-container font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-4"
                        >
                            Schedule Interview
                        </button>
                    )}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-64 p-10 relative min-h-screen overflow-hidden">
                <AnimatePresence mode="wait">
                    {page === 'dashboard' ? (
                        <DashboardView 
                            key="dash"
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                            results={results}
                            isAnalyzing={isAnalyzing}
                            handleAnalyze={handleAnalyze}
                            googleToken={googleToken}
                        />
                    ) : page === 'candidates' ? (
                        <CandidatesView 
                            googleToken={googleToken} 
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            candidate={selectedCandidate}
                            onConfirm={(date, time) => handleConfirmSchedule(selectedCandidate?.id, date, time)}
                        />
                    ) : page === 'pipelines' ? (
                        <PipelinesView 
                            applicants={applicants}
                            onSelectCandidate={(c) => {
                                setSelectedCandidate(c);
                                setPage('candidates');
                            }} 
                        />
                    ) : page === 'settings' ? (
                        <SettingsView />
                    ) : page === 'detail' ? (
                        <CandidateDetailView 
                            key="detail"
                            onBack={() => setPage('dashboard')} 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-on-surface-variant/50 font-medium">
                            <div className="text-center space-y-4">
                                <span className="material-symbols-outlined text-6xl">construction</span>
                                <p>This module is under construction.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
                
                {/* Visual Flair */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-5%] left-[20%] w-[30%] h-[30%] bg-tertiary-container/5 blur-[100px] rounded-full pointer-events-none"></div>
            </main>
        </div>
    );
};

const LoginPage = ({ onLogin }) => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => onLogin(tokenResponse.access_token),
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send',
    });

    return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface font-body">
        <div className="absolute inset-0 indigo-glow opacity-30"></div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md glass-panel p-12 rounded-[2.5rem] border border-white/5 relative z-10 shadow-2xl"
        >
            <div className="flex flex-col items-center mb-12">
                <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30">
                    <span className="material-symbols-outlined text-on-primary text-3xl">auto_awesome</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase font-headline">Concierge AI</h2>
                <p className="text-on-surface-variant text-[10px] font-black tracking-[0.3em] uppercase mt-2">The Digital Curator</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant ml-1">Terminal ID</label>
                    <input className="w-full bg-surface-container-highest border-0 h-14 px-6 rounded-2xl placeholder:opacity-20 focus:ring-1 focus:ring-primary/40 transition-all font-bold text-sm" placeholder="recruiter@concierge.ai" type="email" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant ml-1">Access Key</label>
                   <input className="w-full bg-surface-container-highest border-0 h-14 px-6 rounded-2xl placeholder:opacity-20 focus:ring-1 focus:ring-primary/40 transition-all font-bold text-sm" placeholder="••••••••" type="password" required />
                </div>
                <button type="button" onClick={() => login()} className="primary-gradient h-16 rounded-2xl text-on-primary-container font-black uppercase tracking-[0.15em] text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">dataset_linked</span>
                    Authenticate with Google Workspace
                </button>
            </form>
            
            <div className="mt-10 flex justify-between items-center px-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-outline/30">v4.8.2-STABLE</span>
                <a href="#" className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">Emergency Reset</a>
            </div>
        </motion.div>
    </div>
    );
};

const DashboardView = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, results, isAnalyzing, handleAnalyze, googleToken }) => {
    const [isSending, setIsSending] = useState(false);

    const handleConfirm = async () => {
        if (!googleToken) {
            alert('Google validation token missing. Please relogin to continue.');
            return;
        }
        setIsSending(true);
        try {
            const slot = results[0];
            const dateStr = selectedDate || '2026-03-23';
            const startStr = `${dateStr}T${String(Math.floor(slot.start)).padStart(2, '0')}:${String((slot.start % 1) * 60).padStart(2,'0')}:00+05:30`;
            const endStr = `${dateStr}T${String(Math.floor(slot.end)).padStart(2, '0')}:${String((slot.end % 1) * 60).padStart(2,'0')}:00+05:30`;
            
            const eventInfo = await createMeetEvent(googleToken, {
                summary: 'Interview with Elena Rodriguez',
                description: 'Product Design Panel Interview. Best alignment confirmed via Concierge AI.',
                start: startStr,
                end: endStr,
                attendees: ['adr.debroy@gmail.com'] // TEST CANDIDATE
            });

            await sendInviteEmail(googleToken, 'adr.debroy@gmail.com', 'Interview Confirmation: Product Design Panel', `
                <div style="font-family: sans-serif; color: #1f2a3c; line-height: 1.6;">
                    <h2>Interview Confirmation</h2>
                    <p>Hi Elena,</p>
                    <p>We are excited to confirm your upcoming interview panel for the Product Designer position.</p>
                    <p><strong>Date:</strong> ${selectedDate}<br/>
                    <strong>Time:</strong> ${formatTime(slot.start)} — ${formatTime(slot.end)}</p>
                    <p><strong>Google Meet Link:</strong> <a href="${eventInfo.hangoutLink}">${eventInfo.hangoutLink}</a></p>
                    <p>Best regards,<br/>Concierge AI (The Digital Curator)</p>
                </div>
            `);

            alert('Invite and Google Meet link sent successfully to the candidate!');
        } catch (err) {
            console.error(err);
            alert('Failed to send invite: ' + err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative z-10 font-body">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <h2 className="text-5xl font-black font-headline tracking-tighter leading-none">Scheduling Intelligence</h2>
                <p className="text-on-surface-variant mt-4 text-lg font-medium">Auto-aligning <span className="text-primary font-bold">Elena Rodriguez</span> with the Product Design Panel.</p>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
            <section className="col-span-12 lg:col-span-5 flex flex-col gap-10">
                <GlassCard title="Availability" icon="psychology">
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.25em] font-black text-on-surface-variant">Date</label>
                                <input 
                                    type="date"
                                    className="w-full bg-surface-container-highest border-0 rounded-2xl h-14 px-5 text-sm focus:ring-1 focus:ring-primary/40 transition-all font-medium outline-none appearance-none cursor-pointer"
                                    value={selectedDate}
                                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.25em] font-black text-on-surface-variant">Time</label>
                                <select 
                                    className="w-full bg-surface-container-highest border-0 rounded-2xl h-14 px-5 text-sm focus:ring-1 focus:ring-primary/40 transition-all font-medium outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    disabled={!selectedDate}
                                >
                                    <option value="" disabled>Select Time</option>
                                    {['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        {selectedDate && selectedTime && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 flex flex-col pt-2 w-full overflow-hidden">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.25em] font-black text-on-surface-variant">Available Panel Members</label>
                                    <div className="flex flex-col gap-3">
                                        {ALL_INTERVIEWERS.filter(p => {
                                            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(selectedDate));
                                            const candString = `${dayName} ${selectedTime.replace(' - ', '-')}`;
                                            const candAvail = AvailabilityParser.parseString(candString);
                                            const pAvail = AvailabilityParser.parseString(p.avail);
                                            return SchedulerEngine.findCommonSlots(candAvail, [pAvail], 60).length > 0;
                                        }).length > 0 ? ALL_INTERVIEWERS.filter(p => {
                                            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(selectedDate));
                                            const candString = `${dayName} ${selectedTime.replace(' - ', '-')}`;
                                            const candAvail = AvailabilityParser.parseString(candString);
                                            const pAvail = AvailabilityParser.parseString(p.avail);
                                            return SchedulerEngine.findCommonSlots(candAvail, [pAvail], 60).length > 0;
                                        }).map(p => (
                                            <div key={p.name} className="flex flex-1 items-center gap-4 px-5 py-4 bg-surface-container-highest rounded-2xl border border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black text-sm shadow-inner">{p.name[0]}</div>
                                                <div>
                                                    <p className="text-sm font-black">{p.name}</p>
                                                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.1em] mt-0.5 opacity-80">{p.role}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-xs font-medium italic text-on-surface-variant/50 p-4 text-center">No panel members available for this slot.</p>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="primary-gradient w-full py-5 rounded-2xl text-on-primary-container font-black text-xs uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-3 group shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isAnalyzing ? (
                                        <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">auto_fix_high</span>
                                    )}
                                    {isAnalyzing ? 'Processing Alignment...' : 'Calculate Optimal Slots'}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </GlassCard>

                <GlassCard title="Logic Traces" icon="event_busy">
                    <div className="flex flex-col gap-5">
                        <ConflictItem day="Tue, Oct 24th" reason="Conflict: Marcus Chen (Hiring Manager) has 'Product Sprint Review' recurring blocker." color="error" />
                        <ConflictItem day="Mon, Oct 23rd" reason="Omitted: Candidate explicitly requested no early morning sessions due to overlap." color="secondary" />
                    </div>
                </GlassCard>
            </section>

            <section className="col-span-12 lg:col-span-7 flex flex-col gap-10">
                <AnimatePresence mode="wait">
                    {results.length > 0 ? (
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-10">
                            {/* Best Slot Card */}
                            <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden border border-primary/20 bg-surface-container-high/40 shadow-2xl">
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">Curator's Recommendation</div>
                                </div>
                                
                                <div className="flex items-center gap-10">
                                    <div className="w-28 h-28 primary-gradient rounded-[2rem] flex flex-col items-center justify-center text-on-primary-container shadow-2xl shadow-primary/40">
                                        <span className="text-xs font-black uppercase tracking-widest mb-1">{results[0].day}</span>
                                        <span className="text-5xl font-black leading-none">{selectedDate ? new Date(selectedDate).getDate() : 25}</span>
                                        <span className="text-xs font-black uppercase tracking-widest mt-1 opacity-60">{selectedDate ? new Date(selectedDate).toLocaleString('en-US', { month: 'short' }) : 'Oct'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black tracking-tighter">{formatTime(results[0].start)} — {formatTime(results[0].end)}</h3>
                                        <div className="flex gap-4 mt-5">
                                            <Badge icon="schedule" label={`${(results[0].end - results[0].start) * 60} Minute Session`} />
                                            <Badge icon="videocam" label="Virtual Panel" />
                                        </div>
                                    </div>
                                </div>

                                {/* Reasoning block removed as requested */}

                                <div className="mt-10 flex gap-5">
                                    <button 
                                        onClick={handleConfirm}
                                        disabled={isSending}
                                        className="flex-1 flex justify-center items-center gap-2 primary-gradient py-5 rounded-2xl text-on-primary-container font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isSending ? (
                                            <><span className="animate-spin material-symbols-outlined text-lg">progress_activity</span> Sending Invite...</>
                                        ) : (
                                            'Confirm & Send Invite'
                                        )}
                                    </button>
                                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-1 bg-surface-container-high hover:bg-surface-bright py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Modify Constraints</button>
                                </div>
                            </div>

                            {/* Alternative Options */}
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between px-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl">analytics</span>
                                        Ranked Alternatives
                                    </h3>
                                    <span className="text-[10px] font-black text-outline/40 uppercase tracking-[0.2em]">Ranked by Probability</span>
                                </div>
                                {results.slice(1, 4).map((slot, i) => (
                                    <AlternativeSlot key={i} index={i+2} slot={slot} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-[600px] flex items-center justify-center text-on-surface-variant opacity-20 flex-col gap-6">
                            <span className="material-symbols-outlined text-8xl animate-pulse">filter_center_focus</span>
                            <p className="font-black tracking-[0.5em] uppercase text-xs">Waiting for Analysis Initiation</p>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    </motion.div>
    );
};

const CandidateDetailView = ({ onBack }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-12 relative z-10 font-body">
        <button onClick={onBack} className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.3em] w-fit">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Return to Scheduling Dashboard
        </button>
        
        <header className="flex items-center gap-12">
            <div className="relative">
                <img className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-white/5 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByVHbUuyr-1m7bnKupE9i88hlWAwiRmwgMxRwagTSPzHxixtIZbzZERvj_EBAuHxKi7XaVIHS51NLIN1XSBJH7S1oTgxMkD3K7z-f2D8a4eVeCODUSKtIlVPQxFqEqm_deRLK1Fpwsoo2nEWIeQU7n7Em2kG0Dyv5H3gqFdmBKaYVGOZBPsQ3oEyMYQ-hpjLB7ddDhsa94P3tK0y32On3TlQLCpcMQ3a0D89KT6Fq4UCdmsiJizBv0F9oToHZaZphf8iM07B2n1Oc" />
                <div className="absolute -bottom-3 -right-3 bg-tertiary-container p-3 rounded-2xl border-[6px] border-background shadow-2xl text-on-tertiary-container">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
            </div>
            <div>
                <h2 className="text-6xl font-black tracking-tighter leading-none">Elena Rodriguez</h2>
                <p className="text-2xl text-primary font-bold mt-4">Senior Product Designer <span className="text-on-surface-variant mx-4 opacity-30">|</span> <span className="text-on-surface-variant text-lg">Applied via Portfolio Referral</span></p>
                <div className="flex gap-4 mt-8">
                   <span className="px-6 py-2 bg-surface-container-high rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">Stage: Technical Deep Dive</span>
                   <span className="px-6 py-2 bg-surface-container-high rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">Score: 94/100</span>
                   <span className="px-6 py-2 bg-tertiary-container/10 text-tertiary-container rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-tertiary-container/10">Priority Hire</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">
                <GlassCard title="Availability Heatmap" icon="grid_view">
                    <div className="h-[400px] bg-surface-container-low rounded-3xl flex flex-col p-8 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Weekly Density Analysis</p>
                           <div className="flex gap-6">
                              <HeatmapLegend color="primary" label="Candidate" />
                              <HeatmapLegend color="secondary" label="Interviewer" />
                           </div>
                        </div>
                        <div className="flex-1 grid grid-cols-5 gap-4">
                           {[1,2,3,4,5].map(i => (
                               <div key={i} className="bg-surface-container-highest/30 rounded-2xl border border-white/5 relative overflow-hidden">
                                   <div className={cn("absolute inset-x-0 bg-primary/20 border-y border-primary/30", i === 3 ? "top-20 h-40" : "top-10 h-20")} />
                                   <div className={cn("absolute inset-x-0 bg-secondary-container/20 border-y border-secondary-container/30", i % 2 === 0 ? "top-40 h-24" : "top-24 h-16")} />
                               </div>
                           ))}
                        </div>
                    </div>
                </GlassCard>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
                 <GlassCard title="Interview Panel" icon="groups">
                     <div className="flex flex-col gap-5">
                        <PanelMember name="Marcus Chen" role="Hiring Manager" status="Critical Conflict" color="error" />
                        <PanelMember name="Sarah Jenkins" role="Staff Designer" status="Fully Available" color="tertiary" />
                        <PanelMember name="David Wu" role="CTO" status="Tentative Window" color="secondary" />
                        <div className="mt-4 p-5 bg-surface-container-low rounded-2xl border border-white/5 border-dashed flex items-center justify-center gap-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group">
                            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">add</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Add Alternate Interviewer</span>
                        </div>
                     </div>
                 </GlassCard>
            </div>
        </div>
    </motion.div>
);

const HeatmapLegend = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={cn("w-2.5 h-2.5 rounded-full", color === 'primary' ? 'bg-primary' : 'bg-secondary-container')} />
        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{label}</span>
    </div>
);

const PanelMember = ({ name, role, status, color }) => (
    <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-3xl border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center font-black text-primary text-sm group-hover:scale-110 transition-transform">{name[0]}</div>
        <div className="flex-1">
            <p className="text-sm font-black">{name}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mt-0.5">{role}</p>
        </div>
        <span className={cn("px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.15em]", 
            color === 'error' ? 'bg-error/10 text-error' : 
            color === 'tertiary' ? 'bg-tertiary-container/10 text-tertiary-container' : 
            'bg-secondary-container/10 text-on-secondary-container'
        )}>{status}</span>
    </div>
);

const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}${m === 0 ? '' : ':' + m.toString().padStart(2, '0')} ${suffix}`;
};

const NavItem = ({ icon, label, active = false, onClick }) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group outline-none",
            active ? "bg-surface-container-high text-primary shadow-lg shadow-black/20" : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
        )}
    >
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span className="font-black text-xs tracking-tight uppercase tracking-[0.15em]">{label}</span>
    </button>
);

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-surface-container px-7 py-5 rounded-[2rem] flex items-center gap-6 min-w-[220px] shadow-xl border border-white/5">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", 
            color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-tertiary-container/10 text-tertiary-container')}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">{label}</p>
            <p className="text-xl font-black tracking-tighter leading-none">{value}</p>
        </div>
    </div>
);

const GlassCard = ({ title, icon, children }) => (
    <div className="bg-surface-container p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl border border-white/5">
        <div className="flex items-center gap-4 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">{title}</h3>
        </div>
        {children}
    </div>
);

const ConflictItem = ({ day, reason, color }) => (
    <div className="flex items-start gap-5 p-5 bg-surface-container-low rounded-2xl group hover:bg-surface-container-high transition-all border border-transparent hover:border-white/5">
        <div className={cn("w-2.5 h-2.5 mt-1.5 rounded-full shrink-0", color === 'error' ? 'bg-error shadow-[0_0_12px_rgba(255,180,171,0.6)]' : 'bg-secondary')} />
        <div>
            <p className="text-sm font-black tracking-tight">{day}</p>
            <p className="text-xs text-on-surface-variant font-medium mt-1.5 leading-relaxed opacity-80">{reason}</p>
        </div>
    </div>
);

const Badge = ({ icon, label }) => (
    <span className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-inverse-surface bg-primary/20 px-4 py-2 rounded-full border border-primary/40">
        <span className="material-symbols-outlined text-sm text-primary">{icon}</span>
        {label}
    </span>
);

const AlternativeSlot = ({ index, slot }) => (
    <div className="group flex items-center gap-8 p-6 bg-surface-container-low hover:bg-surface-container-high/60 rounded-[2rem] transition-all cursor-pointer border border-transparent hover:border-primary/20 shadow-lg">
        <div className="text-[10px] font-black text-primary/40 group-hover:text-primary transition-colors">{index.toString().padStart(2, '0')}.</div>
        <div className="flex-1">
            <p className="text-lg font-black tracking-tight">{slot.day}, Oct 25 • {formatTime(slot.start)} — {formatTime(slot.end)}</p>
            <div className="flex gap-4 mt-2">
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Panel Alignment: {slot.participants}/{slot.totalParticipants}</p>
                <div className="w-1 h-1 bg-white/10 rounded-full mt-1.5" />
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Wait: 2d</p>
            </div>
        </div>
        <div className="text-right">
             <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Match Confidence</div>
             <div className="text-3xl font-black text-primary leading-none">{Math.round(slot.score)}%</div>
        </div>
        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1">arrow_forward</span>
    </div>
);

export default App;
