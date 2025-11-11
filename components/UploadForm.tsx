'use client';
import React, { useState } from 'react';

export default function UploadForm(){
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState<string|undefined>();

  const onPickFile = (file: File | null) => {
    if (!file) return;
    const ext = file.name.toLowerCase().split('.').pop() || '';
    if (ext !== 'stl') {
      alert('Demo viewer only supports .stl. Your pipeline will convert STEP/OBJ → STL.');
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setUrl(blobUrl);
    setFileName(file.name);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs uppercase tracking-wide text-slate-400">Demo STL URL</label>
      <input className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm placeholder:text-slate-500"
        value={url}
        onChange={e=>setUrl(e.target.value)}
        placeholder="https://…/model.stl"
      />
      <div className="flex gap-2">
        <button className="btn" onClick={()=>{ if(!url) alert('Paste a URL or choose a file.') }}>Preview</button>
        <button className="btn">Simulate Upload</button>
      </div>
      <div className="border-t border-white/10 pt-5">
        <label className="text-xs uppercase tracking-wide text-slate-400">Or choose a local STL file</label>
        <input type="file" accept=".stl" className="mt-2 block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:opacity-90"
          onChange={(e)=>onPickFile(e.target.files?.[0] || null)}
        />
        {fileName && <p className="mt-2 text-xs text-slate-400">Selected: {fileName}</p>}
      </div>
    </div>
  );
}
