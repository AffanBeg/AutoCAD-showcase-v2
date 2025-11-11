export default function Badge({ children, tone = "gray" }: { children: any, tone?: "gray"|"green"|"yellow"|"red" }) {
  const map = {
    green: "bg-emerald-500/10 border-emerald-500/25 text-emerald-200",
    yellow: "bg-amber-500/10 border-amber-500/25 text-amber-200",
    red: "bg-rose-500/10 border-rose-500/25 text-rose-200",
    gray: "bg-white/5 border-white/10 text-slate-300",
  } as const;
  const dot = {
    green: "bg-emerald-400",
    yellow: "bg-amber-400",
    red: "bg-rose-400",
    gray: "bg-slate-400",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 h-6 rounded-full border ${map[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[tone]}`}></span>
      {children}
    </span>
  );
}
