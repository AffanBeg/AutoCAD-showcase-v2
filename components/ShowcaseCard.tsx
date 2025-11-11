import Badge from "./Badge";

export default function ShowcaseCard({ title, slug, status }:{ title:string; slug:string; status:"ready"|"processing"|"failed" }){
  const tone = status === "ready" ? "green" : status === "processing" ? "yellow" : "red";
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-slate-400">slug: {slug}</p>
        </div>
        <Badge tone={tone as any}>{status}</Badge>
      </div>
      <div className="flex gap-2">
        <button className="btn">Copy Link</button>
        <button className="btn">Visibility</button>
      </div>
    </div>
  );
}
