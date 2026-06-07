'use client'

import { motion } from 'framer-motion'

const templates = [
    { name: 'Minimal', bg: 'bg-white', accent: '#111827', preview: 'border border-slate-200' },
    { name: 'Modern', bg: 'bg-slate-50', accent: '#3B82F6', preview: '' },
    { name: 'Executive', bg: 'bg-neutral-950', accent: '#FBBF24', preview: '' },
    { name: 'Dark', bg: 'bg-zinc-900', accent: '#22D3EE', preview: '' },
    { name: 'Gradient', bg: 'bg-gradient-to-br from-indigo-50 to-white', accent: '#6366F1', preview: '' },
    { name: 'Startup', bg: 'bg-white', accent: '#10B981', preview: '' },
    { name: 'Corporate', bg: 'bg-white', accent: '#1B4F8A', preview: 'border border-slate-200' },
    { name: 'Creative', bg: 'bg-white', accent: '#7C3AED', preview: '' },
]

export function LandingTemplates() {
    return (
        <section id="templates" className="py-20 px-4 sm:px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold tracking-tight">8 beautiful templates</h2>
                    <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                        Every template is optimised for mobile and looks great on any device or screen size
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {templates.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group cursor-pointer"
                        >
                            <div className={`rounded-2xl h-40 ${t.bg} ${t.preview} overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative`}>
                                <div
                                    className="absolute inset-x-0 top-0 h-16 opacity-90"
                                    style={{ background: `linear-gradient(135deg, ${t.accent}cc, ${t.accent})` }}
                                />
                                <div className="absolute top-12 left-4">
                                    <div className="size-10 rounded-xl bg-white shadow" />
                                </div>
                                <div className="absolute top-24 left-4 right-4 space-y-1.5">
                                    <div className="h-2.5 rounded bg-current opacity-10 w-2/3" />
                                    <div className="h-2 rounded bg-current opacity-10 w-1/2" />
                                    <div className="h-7 rounded-lg mt-3" style={{ backgroundColor: `${t.accent}20` }} />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-center mt-2 text-muted-foreground group-hover:text-foreground transition-colors">{t.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
