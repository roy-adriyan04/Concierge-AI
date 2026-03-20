import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const SettingsView = () => {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: 'person' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
        { id: 'team', label: 'Team', icon: 'group' },
        { id: 'api', label: 'API & Webhooks', icon: 'api' },
        { id: 'security', label: 'Security', icon: 'security' }
    ];

    return (
        <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto bg-surface text-on-surface pb-32">
            
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">Workspace Settings</h1>
                <p className="text-on-surface-variant font-medium text-lg">Manage your recruiter profile, team preferences, and system integrations.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Sub Navigation Sidebar */}
                <div className="lg:w-64 flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                                activeTab === tab.id 
                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                                : "text-on-surface-variant hover:bg-white/5"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-16">
                    
                    {/* Account Settings Section */}
                    <section id="account" className="space-y-10">
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-black tracking-tight">Account Settings</h2>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">Save Changes</button>
                        </div>

                        <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700"></div>
                            
                            <div className="flex items-center gap-8 mb-12 relative z-10">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-3xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-white/10 ring-4 ring-primary/10">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-xl shadow-lg border-2 border-surface flex items-center justify-center hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight mb-1">Alexander Sterling</h3>
                                    <p className="text-sm font-medium text-on-surface-variant">Senior Technical Recruiter • EMEA Region</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2">Full Name</label>
                                    <input type="text" defaultValue="Alexander Sterling" className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2">Email Address</label>
                                    <input type="email" defaultValue="alex.sterling@concierge.ai" className="w-full bg-surface-container-high border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all opacity-80" />
                                </div>
                            </div>

                            <div className="mt-12 space-y-6 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2 mb-4">Notification Preferences</p>
                                
                                <div className="flex justify-between items-center p-6 bg-surface-container-high/50 rounded-2xl border border-white/5">
                                    <div>
                                        <p className="text-sm font-bold mb-1">Candidate Applications</p>
                                        <p className="text-[10px] font-medium text-on-surface-variant">Instant email alerts for high-match scores</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-6 bg-surface-container-high/50 rounded-2xl border border-white/5 opacity-60">
                                    <div>
                                        <p className="text-sm font-bold mb-1">Weekly Performance Insights</p>
                                        <p className="text-[10px] font-medium text-on-surface-variant">Editorial summary of hiring pipeline health</p>
                                    </div>
                                    <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Calendar Integrations */}
                    <section id="calendar" className="space-y-8">
                        <h2 className="text-2xl font-black tracking-tight border-b border-white/5 pb-6">Calendar Integrations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-surface-container-lowest rounded-[2rem] p-8 border-l-4 border-l-primary border-y border-r border-white/10 flex justify-between items-center shadow-xl group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                        <span className="material-symbols-outlined text-2xl text-primary">calendar_today</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black mb-1">Google Calendar</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-on-surface-variant">Connected</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-2">link_off</button>
                            </div>

                            <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-white/5 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-2xl text-on-surface-variant">event</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black mb-1">Outlook Calendar</p>
                                        <span className="text-[10px] font-bold text-on-surface-variant">Not connected</span>
                                    </div>
                                </div>
                                <button className="bg-surface-container-high hover:bg-white/10 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 transition-all">Connect</button>
                            </div>
                        </div>
                    </section>

                    {/* Team Management Section */}
                    <section id="team" className="space-y-8">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-black tracking-tight">Team Management</h2>
                            <button className="bg-primary text-on-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                <span className="material-symbols-outlined text-lg">person_add</span> Invite Member
                            </button>
                        </div>
                        
                        <div className="bg-surface-container-lowest rounded-[2rem] border border-white/5 overflow-hidden shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-high/40 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                        <th className="px-8 py-6">Member</th>
                                        <th className="px-8 py-6">Role</th>
                                        <th className="px-8 py-6">Access</th>
                                        <th className="px-8 py-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { name: 'Jane Doe', email: 'jane.doe@concierge.ai', role: 'Admin', access: 'Full access', initial: 'JD' },
                                        { name: 'Marcus Kane', email: 'marcus.k@concierge.ai', role: 'Recruiter', access: 'Pipeline only', initial: 'MK' }
                                    ].map((member, i) => (
                                        <tr key={i} className="hover:bg-white/2">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-black border border-white/10">{member.initial}</div>
                                                    <div>
                                                        <p className="text-sm font-bold leading-none mb-1">{member.name}</p>
                                                        <p className="text-[10px] font-medium text-on-surface-variant">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black tracking-widest uppercase bg-surface-container-high px-3 py-1.5 rounded-lg border border-white/5">{member.role}</span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-medium text-on-surface-variant">{member.access}</td>
                                            <td className="px-8 py-6">
                                                <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">more_vert</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* API Configuration */}
                    <section id="api" className="space-y-8">
                        <h2 className="text-2xl font-black tracking-tight border-b border-white/5 pb-6">API Configuration</h2>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            
                            <div className="bg-surface-container-lowest rounded-[2rem] p-10 border border-white/5 shadow-xl flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary">key</span>
                                    <h3 className="text-base font-black uppercase tracking-widest">Production API Key</h3>
                                </div>
                                <div className="bg-black/40 rounded-2xl p-6 flex items-center justify-between border border-white/5 group">
                                    <code className="text-sm font-mono text-on-surface-variant tracking-wider">sk_live_51MszJ2PF8q6R...</code>
                                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">content_copy</button>
                                </div>
                                <p className="text-[9px] font-medium text-on-surface-variant leading-relaxed opacity-60">Generated on Oct 12, 2026. Keep this key secret to protect your workspace data.</p>
                                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-2xl hover:bg-white/5 transition-all">Regenerate Key</button>
                            </div>

                            <div className="bg-surface-container-lowest rounded-[2rem] p-10 border border-white/5 shadow-xl flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="material-symbols-outlined text-primary">hub</span>
                                        <h3 className="text-base font-black uppercase tracking-widest">Global Webhooks</h3>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-on-surface-variant">Pipeline Updates</span>
                                        <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-on-surface-variant">Candidate Status Change</span>
                                        <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">Active</span>
                                    </div>
                                </div>
                                <button className="w-full mt-10 py-5 bg-surface-container-high hover:bg-surface-bright text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/5 transition-all shadow-sm">Configure URLs</button>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
