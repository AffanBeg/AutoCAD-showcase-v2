import ShowcaseCard from "@/components/ShowcaseCard";

const DEMO = [
  { id: "1", title: "Gear Housing", slug: "gear-housing", status: "ready" },
  { id: "2", title: "Robot Arm", slug: "robot-arm", status: "processing" },
  { id: "3", title: "Bracket V2", slug: "bracket-v2", status: "failed" }
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Showcases</h1>
        <a className="btn" href="/dashboard/new">New Showcase</a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEMO.map(x => <ShowcaseCard key={x.id} {...x as any} />)}
      </div>
    </section>
  );
}
