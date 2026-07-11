'use client';

export default function Card({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-[#1f1638] border border-white/5 rounded-3xl p-5 shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
