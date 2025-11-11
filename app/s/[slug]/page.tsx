import ViewerSTL from "@/components/ViewerSTL";

export default function ShowcasePublicPage({ params }: { params: { slug: string } }) {
  const demoUrl = "";
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Showcase: {params.slug}</h1>
          <p className="text-slate-400 text-sm">Status: ready</p>
        </div>
        <div className="flex gap-2">
          <button className="btn">Share</button>
          <button className="btn">Set Public</button>
        </div>
      </div>
      <ViewerSTL url={demoUrl} />
      <div className="card">
        <h4 className="font-medium mb-2">Details</h4>
        <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
          <li>File type: STL (binary)</li>
          <li>Source: Converted from STEP/OBJ (background worker)</li>
          <li>Viewer: Three.js + OrbitControls</li>
        </ul>
      </div>
    </section>
  );
}
