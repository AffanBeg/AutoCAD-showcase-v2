import UploadForm from "@/components/UploadForm";

export default function NewShowcasePage() {
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">New Showcase</h1>
      <p className="text-slate-400 text-sm">Drop a CAD file or paste a link. We’ll convert STEP/OBJ → STL in the background.</p>
      <UploadForm />
    </section>
  );
}
