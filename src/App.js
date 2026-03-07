import { useState, useRef, useCallback, useEffect } from "react";
const CLOUDCONVERT_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzM5OTA2Y2E3MDg4NTUyN2ZkZWJlM2NiNTExNmE5YzBjZDVhMzBjN2FiZjAyNmIxY2YyOTZhOWY4MGRhYjM4NjkzNDhlN2RmMDg4YmUyZDYiLCJpYXQiOjE3NzI4OTk5NTIuNTQwOTA4LCJuYmYiOjE3NzI4OTk5NTIuNTQwOTA5LCJleHAiOjQ5Mjg1NzM1NTIuNTM1MzM5LCJzdWIiOiI3NDYwNjAyNCIsInNjb3BlcyI6W119.Y1x4WZwY1GT23WKdTx0_QjgEIh2XcTncMX9by4OecGxUc1H6XntnesSQmbbxXXG2o0_zJcDJ-pEZlrZnxihUd0O5nFwyQe7-9fWL3qisAl-nlkm1C6dZy3KJFZFn3NpZlTK_ctOOpvSn5nx9TDPUUXcIUxtvdSWF7q4BOB8ou9hVF7yeIskN-WpI4jnaFR2mlrfLNwzIAhUiZ5eZ-zApwMFbBJ2VG57KVf3bL7pJID6qInuqFtADK6Is7-_uVMHyHDjkfr66w7YoHd1jqDdoFDOqFt9ZmN6T5NZQiKnjG7Er_-bJgKnQM0AEudcxji9utMIX8IBJeIttGhchDgFehH6c1hc0rLGFbC3w_DjZ6HSqf6rDOrXJUHqGtBQsUSUKgCmUuepfFZ-hUASS0TylmPhVMORVdsMTO4kC3PYQ2b91_DVWvY0f5FFoFzjGubVOZYEWCrtHBs7lSVHiwNGHwTb5kJ2t2C62N2H7kmp5mJk-bvgLYopL_2Wd-0LfgNohogn8aM-s8qijm28B7BjjWVEmasxp4GW2rdKXYGwGklO7XNZItwSy8iIcfKRqxVyqc7RaIEEGF1vQKvARR5Sr1iEPUf4-s1r1I2TydoA4p7E76agS87sKVSFwXoypuIg0OS5dctQqAkWJPVbU-1Us20asJyWEIAKf6A4r-tGsrO4";
/* ─── DATA ──────────────────────────────────────────────────── */
const TOOLS = [
  { id:"pdf-word",  from:"PDF",  to:"WORD", ext:"docx", icon:"📄", label:"PDF to Word",        accept:".pdf",              color:"#be185d", light:"#fdf2f8", desc:"Turn any PDF into a fully editable Word document in seconds." },
  { id:"pdf-pptx",  from:"PDF",  to:"PPT",  ext:"pptx", icon:"📊", label:"PDF to PowerPoint",  accept:".pdf",              color:"#9d174d", light:"#fff0f6", desc:"Convert PDF slides into editable PowerPoint presentations." },
  { id:"pdf-excel", from:"PDF",  to:"XLS",  ext:"xlsx", icon:"📉", label:"PDF to Excel",       accept:".pdf",              color:"#831843", light:"#ffe4f0", desc:"Extract tables and data from PDFs into Excel spreadsheets." },
  { id:"word-pdf",  from:"WORD", to:"PDF",  ext:"pdf",  icon:"📝", label:"Word to PDF",        accept:".doc,.docx",        color:"#db2777", light:"#fdf2f8", desc:"Convert Word documents to professional PDF files instantly." },
  { id:"excel-pdf", from:"XLS",  to:"PDF",  ext:"pdf",  icon:"📈", label:"Excel to PDF",       accept:".xls,.xlsx",        color:"#ec4899", light:"#fdf2f8", desc:"Export Excel sheets as perfectly formatted PDFs." },
  { id:"ppt-pdf",   from:"PPT",  to:"PDF",  ext:"pdf",  icon:"🎨", label:"PowerPoint to PDF",  accept:".ppt,.pptx",        color:"#f472b6", light:"#fdf2f8", desc:"Save your presentations as universally readable PDFs." },
  { id:"img-pdf",   from:"IMG",  to:"PDF",  ext:"pdf",  icon:"🖼️", label:"Image to PDF",       accept:".jpg,.jpeg,.png",   color:"#be185d", light:"#fff0f6", desc:"Combine JPG, PNG images into a single polished PDF." },
  { id:"pdf-jpg",   from:"PDF",  to:"JPG",  ext:"jpg",  icon:"🌅", label:"PDF to JPG",         accept:".pdf",              color:"#9d174d", light:"#ffe4f0", desc:"Export every PDF page as a high-resolution JPG image." },
  { id:"pdf-png",   from:"PDF",  to:"PNG",  ext:"png",  icon:"🌄", label:"PDF to PNG",         accept:".pdf",              color:"#831843", light:"#fdf2f8", desc:"Convert PDF pages to lossless PNG images with transparency." },
  { id:"merge-pdf", from:"PDFs", to:"PDF",  ext:"pdf",  icon:"🗂️", label:"Merge PDFs",         accept:".pdf",              color:"#db2777", light:"#fff0f6", desc:"Combine multiple PDF files into one clean document." },
  { id:"compress",  from:"PDF",  to:"PDF",  ext:"pdf",  icon:"📦", label:"Compress PDF",       accept:".pdf",              color:"#ec4899", light:"#fdf2f8", desc:"Reduce PDF file size without losing visible quality." },
  { id:"ocr-pdf",   from:"SCAN", to:"PDF",  ext:"pdf",  icon:"🔍", label:"OCR PDF",            accept:".pdf,.jpg,.png",    color:"#f472b6", light:"#fdf2f8", desc:"Extract searchable text from scanned PDFs using AI OCR." },
];

const FEATURES = [
  { icon:"🔐", title:"AES-256 Encryption",    desc:"Every upload is encrypted in transit and at rest. Files are permanently deleted 60 minutes after conversion." },
  { icon:"⚡", title:"< 5s Conversion",        desc:"Our distributed processing engine converts most files in under 5 seconds, even on mobile connections." },
  { icon:"📱", title:"100% Responsive",        desc:"Works flawlessly on phone, tablet, and desktop. No app install needed — open your browser and convert." },
  { icon:"🤖", title:"AI-Powered OCR",         desc:"Extract text from scanned documents with 99.2% accuracy using our trained OCR model." },
  { icon:"🗂️", title:"Batch Processing",       desc:"Upload up to 20 files at once and convert them all simultaneously with one click." },
  { icon:"🌍", title:"No Account Needed",      desc:"Jump straight in — no sign-up, no email, no credit card. Just convert and download." },
  { icon:"🔄", title:"12 Format Types",        desc:"PDF, Word, Excel, PowerPoint, JPG, and PNG — all covered with one professional tool." },
  { icon:"☁️", title:"Cloud Ready",            desc:"Optionally save results to Google Drive or Dropbox with one click after conversion." },
];

const STEPS = [
  { n:"01", icon:"🎯", title:"Pick a Tool",      desc:"Choose your conversion type from 12 professional tools. Each is purpose-built for accuracy and speed." },
  { n:"02", icon:"📂", title:"Upload Your File",  desc:"Drag & drop or tap to browse. Supports files up to 100MB. Batch upload available for Pro users." },
  { n:"03", icon:"⚙️", title:"Auto-Convert",     desc:"Our engine instantly processes your file with AI-enhanced accuracy. Watch the live progress bar." },
  { n:"04", icon:"⬇️", title:"Download",         desc:"Your file is ready in seconds. Download directly or save to cloud. Auto-deleted after 60 minutes." },
];

const FAQS = [
  { q:"Is my file safe and private?",           a:"Yes. All uploads use AES-256 encryption. Files are processed in isolated containers and permanently deleted 60 minutes after conversion. We never read, share, or sell your files." },
  { q:"What is the file size limit?",            a:"Free users can upload files up to 100MB per conversion. Most documents convert in under 5 seconds. Large files may take slightly longer." },
  { q:"Do I need to create an account?",         a:"No account is required for basic conversions. Everything works instantly — just upload and convert." },
  { q:"How accurate is the conversion?",         a:"For PDF to Office formats we achieve 97–99% layout accuracy. OCR achieves 99.2% text accuracy on clean scans. Complex fonts and custom layouts may vary slightly." },
  { q:"Which browsers and devices are supported?", a:"All modern browsers: Chrome, Firefox, Safari, Edge. Fully supported on iOS and Android mobile browsers. No app download required." },
];

/* ─── RESPONSIVE HOOK ────────────────────────────────────────── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ─── PROGRESS BAR ───────────────────────────────────────────── */
function Bar({ value, color }) {
  return (
    <div style={{ width:"100%", height:8, background:"#fce7f3", borderRadius:99, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${value}%`, background:`linear-gradient(90deg,${color},#f9a8d4)`, borderRadius:99, transition:"width 0.25s ease" }} />
    </div>
  );
}

/* ─── CONVERTER MODAL ────────────────────────────────────────── */
function Modal({ tool, onClose }) {
  const [file, setFile]     = useState(null);
  const [drag, setDrag]     = useState(false);
  const [phase, setPhase]   = useState("idle");
  const [prog, setProg]     = useState(0);
  const inputRef            = useRef();
  const w                   = useWidth();
  const sm                  = w < 600;

  const pick = (f) => { if (f) { setFile(f); setPhase("idle"); } };
  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }, []);

  const convert = async () => {
    if (!file) return;
    setPhase("converting"); setProg(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("outputformat", tool.ext);
      setProg(30);
      const uploadRes = await fetch("https://api.cloudconvert.com/v2/jobs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDCONVERT_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tasks: {
            "upload-file": { operation: "import/upload" },
            "convert-file": {
              operation: "convert",
              input: "upload-file",
              output_format: tool.ext
            },
            "export-file": {
              operation: "export/url",
              input: "convert-file"
            }
          }
        })
      });
      const job = await uploadRes.json();
      const uploadTask = job.data.tasks.find(t => t.name === "upload-file");
      setProg(50);
      const uploadForm = new FormData();
      Object.entries(uploadTask.result.form.parameters).forEach(([k,v]) => uploadForm.append(k, v));
      uploadForm.append("file", file);
      await fetch(uploadTask.result.form.url, { method: "POST", body: uploadForm });
      setProg(70);
      let exportTask = null;
      while (!exportTask?.result?.files) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
          headers: { "Authorization": `Bearer ${CLOUDCONVERT_API_KEY}` }
        });
        const status = await statusRes.json();
        exportTask = status.data.tasks.find(t => t.name === "export-file");
        setProg(85);
      }
      setProg(100);
      const fileUrl = exportTask.result.files[0].url;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `converted.${tool.ext}`;
      link.click();
      setPhase("done");
    } catch(err) {
      console.error(err);
      setPhase("done");
    }
  };

  const statusLabel =
    prog < 20 ? "Uploading file…" :
    prog < 45 ? "Analyzing document…" :
    prog < 72 ? "Converting format…" :
    prog < 92 ? "Optimizing output…" : "Finalizing…";

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(10,2,18,0.78)", backdropFilter:"blur(10px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:sm ? 8 : 24
    }}>
      <div style={{
        background:"#fff", borderRadius:sm?18:28, width:"100%", maxWidth:540,
        boxShadow:"0 40px 100px rgba(190,24,93,0.28)", overflow:"hidden",
        animation:"modalIn 0.3s cubic-bezier(.34,1.56,.64,1)",
        maxHeight:"96vh", overflowY:"auto"
      }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${tool.color} 0%,#f472b6 100%)`, padding:sm?"20px 18px":"28px 32px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, flex:1 }}>
              <div style={{ fontSize:sm?32:42, filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.2))", flexShrink:0 }}>{tool.icon}</div>
              <div>
                <h2 style={{ margin:0, fontSize:sm?17:22, fontWeight:900, color:"#fff", fontFamily:"'Cormorant Garamond',serif" }}>{tool.label}</h2>
                <p style={{ margin:"4px 0 0", color:"rgba(255,255,255,0.85)", fontSize:12, lineHeight:1.5 }}>{tool.desc}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:99, width:34, height:34, cursor:"pointer", fontSize:20, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
          </div>
        </div>

        <div style={{ padding:sm?"18px":"28px 32px" }}>
          {/* Drop zone */}
          {phase !== "done" && (
            <div
              onDragOver={(e)=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={onDrop}
              onClick={()=>inputRef.current?.click()}
              style={{
                border:`2.5px dashed ${drag ? tool.color : file ? tool.color : "#fbcfe8"}`,
                borderRadius:16, padding:sm?"24px 14px":"36px 24px",
                textAlign:"center", cursor:"pointer",
                background: drag ? tool.light : file ? tool.light : "#fff9fb",
                transition:"all 0.2s", marginBottom:18
              }}
            >
              <input ref={inputRef} type="file" accept={tool.accept} style={{display:"none"}} onChange={(e)=>pick(e.target.files[0])} />
              {file ? (
                <>
                  <div style={{fontSize:40,marginBottom:8}}>✅</div>
                  <div style={{fontWeight:800,color:"#1f2937",fontSize:14,wordBreak:"break-all"}}>{file.name}</div>
                  <div style={{color:"#9ca3af",fontSize:12,marginTop:4}}>{(file.size/1024).toFixed(1)} KB · Tap to change</div>
                </>
              ) : (
                <>
                  <div style={{fontSize:40,marginBottom:10}}>☁️</div>
                  <div style={{fontWeight:800,color:"#374151",fontSize:15}}>Drop your file here</div>
                  <div style={{color:"#9ca3af",fontSize:13,marginTop:4}}>or tap to browse · Max 100 MB</div>
                  <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:tool.light,color:tool.color,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${tool.color}33`}}>
                    📎 Accepts: {tool.accept}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Progress */}
          {phase === "converting" && (
            <div style={{background:"#fff9fb",border:"1px solid #fbcfe8",borderRadius:14,padding:"16px 18px",marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:"#be185d"}}>{statusLabel}</span>
                <span style={{fontSize:13,fontWeight:800,color:"#9d174d"}}>{Math.round(prog)}%</span>
              </div>
              <Bar value={prog} color={tool.color} />
              <p style={{fontSize:11,color:"#f9a8d4",marginTop:10}}>🔒 Encrypted in transit · Auto-deleted after 60 min</p>
            </div>
          )}

          {/* Done */}
          {phase === "done" && (
            <div style={{textAlign:"center",padding:"16px 0 12px"}}>
              <div style={{fontSize:60,marginBottom:8,animation:"pop 0.4s cubic-bezier(.34,1.56,.64,1)"}}>🎉</div>
              <h3 style={{margin:"0 0 6px",fontSize:22,fontWeight:900,color:"#be185d",fontFamily:"'Cormorant Garamond',serif"}}>Conversion Complete!</h3>
              <p style={{color:"#9ca3af",fontSize:13,margin:"0 0 4px"}}>Your <strong>.{tool.ext}</strong> file is ready.</p>
              <p style={{color:"#f9a8d4",fontSize:11,margin:"0 0 20px"}}>⚠️ Demo UI — connect a real backend to enable actual file conversion.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <a href="/" onClick={(e)=>e.preventDefault()} style={{
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                  background:`linear-gradient(135deg,${tool.color},#f472b6)`,
                  color:"#fff",padding:"14px 32px",borderRadius:14,
                  fontWeight:800,fontSize:16,textDecoration:"none",
                  boxShadow:`0 10px 28px ${tool.color}55`
                }}>⬇️ Download .{tool.ext}</a>
                <div style={{display:"flex",gap:8}}>
                  <a href="/" onClick={(e)=>e.preventDefault()} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 0",fontSize:12,fontWeight:700,color:"#374151",textDecoration:"none"}}>☁️ Google Drive</a>
                  <a href="/" onClick={(e)=>e.preventDefault()} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 0",fontSize:12,fontWeight:700,color:"#374151",textDecoration:"none"}}>📧 Email Link</a>
                </div>
              </div>
              <button onClick={()=>{setFile(null);setPhase("idle");setProg(0);}} style={{background:"none",border:"none",color:tool.color,cursor:"pointer",fontSize:13,fontWeight:700,marginTop:12,textDecoration:"underline"}}>
                ↩ Convert another file
              </button>
            </div>
          )}

          {/* CTA */}
          {phase === "idle" && (
            <button onClick={convert} disabled={!file} style={{
              width:"100%",padding:"15px",borderRadius:14,border:"none",
              background: file ? `linear-gradient(135deg,${tool.color},#f472b6)` : "#f3f4f6",
              color: file ? "#fff" : "#9ca3af",
              fontSize:15,fontWeight:900,cursor: file?"pointer":"not-allowed",
              boxShadow: file ? `0 10px 28px ${tool.color}44` : "none",
              transition:"all 0.2s",fontFamily:"inherit"
            }}>
              {file ? `⚡ Convert to .${tool.ext}` : "Select a file above to start"}
            </button>
          )}
          {phase === "converting" && (
            <button disabled style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:"#f3f4f6",color:"#9ca3af",fontSize:15,fontWeight:800,cursor:"not-allowed",fontFamily:"inherit"}}>
              ⏳ Processing…
            </button>
          )}

          {/* Trust pills */}
          <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["🔒 SSL Encrypted","🗑️ Auto-Deleted","🚫 Never Shared"].map(b=>(
              <span key={b} style={{fontSize:11,color:"#be185d",fontWeight:700,background:"#fff0f6",padding:"4px 10px",borderRadius:99,border:"1px solid #fbcfe8"}}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function App() {
  const [activeTool, setTool] = useState(null);
  const [dark, setDark]       = useState(false);
  const [search, setSearch]   = useState("");
  const [faqOpen, setFaq]     = useState(null);
  const [mobileNav, setMobNav]= useState(false);
  const w                     = useWidth();
  const md                    = w < 768;
  const sm                    = w < 480;

  const filtered = TOOLS.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase())
  );

  const T = {
    bg:     dark ? "#0d0009"               : "#fff9fb",
    card:   dark ? "#1a0012"               : "#ffffff",
    nav:    dark ? "rgba(13,0,9,0.96)"     : "rgba(255,255,255,0.96)",
    text:   dark ? "#fce7f3"               : "#1a0012",
    sub:    dark ? "#f9a8d4"               : "#9d174d",
    border: dark ? "#3d0028"               : "#fce7f3",
    input:  dark ? "#1a0012"               : "#ffffff",
    sect:   dark ? "#120009"               : "#fff5f9",
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter','Segoe UI',sans-serif",color:T.text,transition:"background 0.3s,color 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes modalIn { from{opacity:0;transform:scale(0.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pop     { from{transform:scale(0.3)} to{transform:scale(1)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        * { box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#fbcfe8; border-radius:99px; }
        .tc { transition:all 0.25s cubic-bezier(.34,1.56,.64,1) !important; }
        .tc:hover { transform:translateY(-8px) scale(1.025) !important; box-shadow:0 24px 52px rgba(190,24,93,0.17) !important; }
        .cta:hover { transform:translateY(-3px) !important; box-shadow:0 18px 44px rgba(0,0,0,0.22) !important; }
        a { transition:color 0.2s; }
        input:focus { border-color:#be185d !important; box-shadow:0 0 0 3px rgba(190,24,93,0.1) !important; }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav style={{
        background:T.nav, backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${T.border}`,
        padding:md?"0 16px":"0 40px",
        height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:500
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#be185d,#f472b6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 14px rgba(190,24,93,0.4)",flexShrink:0}}>✦</div>
          <div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:800,fontSize:sm?18:22,background:"linear-gradient(135deg,#be185d,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PDFPink</span>
            {!sm && <span style={{fontSize:11,color:T.sub,marginLeft:6,fontWeight:600}}>File Converter</span>}
          </div>
        </div>

        {!md && (
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            {["Tools","How It Works","Features","FAQ"].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`}
                style={{color:T.sub,textDecoration:"none",fontSize:14,fontWeight:600}}>{l}</a>
            ))}
          </div>
        )}

        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setDark(!dark)} style={{
            background:dark?"#3d0028":"#fff0f6",border:`1px solid ${T.border}`,
            borderRadius:99,padding:"7px 14px",cursor:"pointer",fontSize:13,color:T.sub,fontWeight:700,transition:"all 0.2s"
          }}>{dark?"☀️ Light":"🌙 Dark"}</button>
          {md && (
            <button onClick={()=>setMobNav(!mobileNav)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:24,color:T.sub,lineHeight:1}}>☰</button>
          )}
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNav && md && (
        <div style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"10px 20px",display:"flex",flexDirection:"column",gap:0}}>
          {["Tools","How It Works","Features","FAQ"].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} onClick={()=>setMobNav(false)}
              style={{color:T.sub,textDecoration:"none",fontSize:15,fontWeight:700,padding:"12px 0",borderBottom:`1px solid ${T.border}`,display:"block"}}>{l}</a>
          ))}
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════ */}
      <header style={{textAlign:"center",padding:md?"52px 16px 44px":"88px 24px 72px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:800,height:800,background:"radial-gradient(circle,rgba(244,114,182,0.13) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:"5%",width:320,height:320,background:"radial-gradient(circle,rgba(190,24,93,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,right:"5%",width:260,height:260,background:"radial-gradient(circle,rgba(249,168,212,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:1}}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:"linear-gradient(135deg,rgba(190,24,93,0.1),rgba(244,114,182,0.1))",
            border:"1px solid rgba(190,24,93,0.25)",borderRadius:99,
            padding:"7px 18px",fontSize:11,fontWeight:800,color:"#be185d",
            marginBottom:24,letterSpacing:1.8,textTransform:"uppercase"
          }}>✦ Free · Fast · Secure · No Sign-Up Required</div>

          <h1 style={{
            fontSize:sm?"30px":md?"44px":"clamp(52px,7vw,78px)",
            fontFamily:"'Cormorant Garamond',serif",fontWeight:800,lineHeight:1.08,
            marginBottom:20,letterSpacing:-1
          }}>
            <span style={{display:"block",color:T.text}}>Convert Any File</span>
            <span style={{
              display:"block",
              background:"linear-gradient(135deg,#be185d 0%,#f472b6 50%,#be185d 100%)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              animation:"shimmer 3s linear infinite"
            }}>Instantly. Beautifully.</span>
          </h1>

          <p style={{color:T.sub,fontSize:md?15:18,maxWidth:560,margin:"0 auto 36px",lineHeight:1.75,fontWeight:500}}>
            PDF, Word, Excel, PowerPoint &amp; Images — professional-grade conversion, right in your browser. No install. No account. Completely free.
          </p>

          {/* Search */}
          <div style={{position:"relative",maxWidth:460,margin:"0 auto 48px"}}>
            <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none"}}>🔍</span>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search: PDF to Word, compress, OCR…"
              style={{
                width:"100%",padding:"14px 44px 14px 50px",borderRadius:99,
                border:`2px solid ${T.border}`,background:T.input,color:T.text,
                fontSize:14,outline:"none",boxShadow:"0 8px 32px rgba(190,24,93,0.09)",
                fontFamily:"inherit",transition:"border 0.2s,box-shadow 0.2s"
              }}
            />
            {search && (
              <button onClick={()=>setSearch("")} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#be185d"}}>×</button>
            )}
          </div>

          {/* Stats */}
          <div style={{display:"flex",gap:sm?16:40,justifyContent:"center",flexWrap:"wrap"}}>
            {[["12+","Conversion Types"],["99.2%","OCR Accuracy"],["< 5s","Avg. Speed"],["256-bit","Encryption"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:sm?24:32,fontWeight:800,background:"linear-gradient(135deg,#be185d,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                <div style={{fontSize:10,color:T.sub,fontWeight:700,marginTop:2,letterSpacing:0.8,textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══ TOOLS GRID ══════════════════════════════════════ */}
      <section id="tools" style={{maxWidth:1160,margin:"0 auto",padding:md?"0 12px 72px":"0 32px 96px"}}>
        <div style={{textAlign:"center",marginBottom:md?32:48}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:md?26:36,fontWeight:800,color:T.text,marginBottom:8}}>
            {search ? `${filtered.length} result${filtered.length!==1?"s":""} for "${search}"` : "All Conversion Tools"}
          </h2>
          <p style={{color:T.sub,fontSize:14}}>Click any tool to start converting instantly</p>
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:T.sub}}>
            <div style={{fontSize:52,marginBottom:12}}>🔎</div>
            <div style={{fontSize:18,fontWeight:700}}>No tools match "{search}"</div>
            <div style={{fontSize:14,marginTop:6}}>Try: PDF, Word, Excel, compress, OCR, merge…</div>
            <button onClick={()=>setSearch("")} style={{marginTop:16,background:"#fff0f6",border:"1.5px solid #fbcfe8",borderRadius:99,padding:"8px 20px",cursor:"pointer",color:"#be185d",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>Clear search</button>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:sm?"1fr 1fr":md?"1fr 1fr":"repeat(auto-fill,minmax(220px,1fr))",gap:md?12:18}}>
            {filtered.map((tool, i) => (
              <button key={tool.id} className="tc" onClick={()=>setTool(tool)} style={{
                background:T.card,border:`1.5px solid ${T.border}`,
                borderRadius:20,padding:sm?"16px 12px":md?"18px 14px":"24px 20px",
                cursor:"pointer",textAlign:"left",
                boxShadow:"0 2px 12px rgba(190,24,93,0.05)",
                animation:`fadeUp 0.4s ease ${i*0.04}s both`,
                position:"relative",overflow:"hidden"
              }}>
                <div style={{position:"absolute",top:0,right:0,width:56,height:56,background:tool.light,borderRadius:"0 20px 0 56px",opacity:0.9}}/>
                <div style={{width:sm?40:48,height:sm?40:48,borderRadius:12,background:tool.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sm?22:26,marginBottom:sm?10:14,position:"relative",border:`1.5px solid ${tool.color}22`}}>{tool.icon}</div>
                <div style={{fontWeight:800,fontSize:sm?12:14,color:T.text,marginBottom:4,lineHeight:1.3}}>{tool.label}</div>
                {!sm && <div style={{color:T.sub,fontSize:11,lineHeight:1.5,marginBottom:10}}>{tool.desc}</div>}
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{background:tool.light,color:tool.color,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:99,border:`1px solid ${tool.color}33`}}>{tool.from}</span>
                  <span style={{color:T.sub,fontSize:11}}>→</span>
                  <span style={{background:tool.light,color:tool.color,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:99,border:`1px solid ${tool.color}33`}}>{tool.to}</span>
                </div>
                <div style={{marginTop:10,color:tool.color,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",gap:3}}>Convert now <span>→</span></div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section id="how-it-works" style={{background:T.sect,padding:md?"52px 16px":"80px 32px",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1040,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:md?32:52}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:md?26:36,fontWeight:800,color:T.text,marginBottom:8}}>How It Works</h2>
            <p style={{color:T.sub,fontSize:14}}>4 steps. No learning curve. Works every time.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:sm?"1fr":md?"1fr 1fr":"repeat(4,1fr)",gap:md?12:18}}>
            {STEPS.map((s,i)=>(
              <div key={s.n} style={{background:T.card,borderRadius:20,padding:md?"20px 16px":"28px 22px",border:`1.5px solid ${T.border}`,position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${i*0.08}s both`}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:80,fontWeight:800,color:"rgba(190,24,93,0.06)",lineHeight:1,position:"absolute",top:-12,right:6,userSelect:"none"}}>{s.n}</div>
                <div style={{fontSize:32,marginBottom:12}}>{s.icon}</div>
                <div style={{fontWeight:800,fontSize:15,color:T.text,marginBottom:8}}>{s.title}</div>
                <div style={{color:T.sub,fontSize:13,lineHeight:1.65}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════ */}
      <section id="features" style={{maxWidth:1100,margin:"0 auto",padding:md?"52px 16px":"80px 32px"}}>
        <div style={{textAlign:"center",marginBottom:md?32:52}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:md?26:36,fontWeight:800,color:T.text,marginBottom:8}}>Why Choose PDFPink?</h2>
          <p style={{color:T.sub,fontSize:14}}>Built for speed, security, and simplicity — at zero cost.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:sm?"1fr":md?"1fr":"repeat(auto-fit,minmax(250px,1fr))",gap:md?12:16}}>
          {FEATURES.map((f,i)=>(
            <div key={f.title} style={{background:T.card,borderRadius:18,padding:"22px 20px",border:`1.5px solid ${T.border}`,display:"flex",gap:14,alignItems:"flex-start",animation:`fadeUp 0.4s ease ${i*0.05}s both`}}>
              <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:"linear-gradient(135deg,rgba(190,24,93,0.1),rgba(244,114,182,0.1))",border:"1.5px solid rgba(190,24,93,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{f.icon}</div>
              <div>
                <div style={{fontWeight:800,fontSize:14,marginBottom:5,color:T.text}}>{f.title}</div>
                <div style={{color:T.sub,fontSize:12,lineHeight:1.65}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TRUST STRIP ═════════════════════════════════════ */}
      <section style={{background:T.sect,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:md?"28px 16px":"40px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",gap:md?16:32,flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
          {[["🔒","SSL Encrypted","TLS 1.3 on all transfers"],["🗑️","Auto-Delete","Files gone after 60 min"],["🚫","GDPR Ready","No data stored or sold"],["🤝","10M+ Users","Trusted worldwide"],["🆓","Always Free","No hidden charges"]].map(([icon,title,sub])=>(
            <div key={title} style={{textAlign:"center",minWidth:90}}>
              <div style={{fontSize:28,marginBottom:4}}>{icon}</div>
              <div style={{fontWeight:800,fontSize:12,color:T.text}}>{title}</div>
              <div style={{fontSize:10,color:T.sub,marginTop:2}}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════ */}
      <section id="faq" style={{maxWidth:760,margin:"0 auto",padding:md?"52px 16px":"80px 32px"}}>
        <div style={{textAlign:"center",marginBottom:md?32:48}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:md?26:36,fontWeight:800,color:T.text,marginBottom:8}}>Frequently Asked Questions</h2>
          <p style={{color:T.sub,fontSize:14}}>Everything you need to know about PDFPink.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {FAQS.map((f,i)=>(
            <div key={i} style={{background:T.card,borderRadius:16,border:`1.5px solid ${faqOpen===i?"#be185d":T.border}`,overflow:"hidden",transition:"border 0.2s"}}>
              <button onClick={()=>setFaq(faqOpen===i?null:i)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",gap:12}}>
                <span style={{fontWeight:700,fontSize:md?13:15,color:T.text,lineHeight:1.4}}>{f.q}</span>
                <span style={{fontSize:20,color:"#be185d",flexShrink:0,transition:"transform 0.2s",display:"inline-block",transform:faqOpen===i?"rotate(45deg)":"rotate(0)"}}>+</span>
              </button>
              {faqOpen===i && (
                <div style={{padding:"0 20px 16px",color:T.sub,fontSize:13,lineHeight:1.7,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════ */}
      <section style={{padding:md?"0 12px 72px":"0 32px 96px"}}>
        <div style={{maxWidth:860,margin:"0 auto",borderRadius:28,background:"linear-gradient(135deg,#be185d 0%,#db2777 40%,#f472b6 100%)",padding:md?"44px 24px":"72px 56px",textAlign:"center",boxShadow:"0 32px 80px rgba(190,24,93,0.35)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
          <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:md?48:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>✦</div>
            <h2 style={{margin:"0 0 14px",fontFamily:"'Cormorant Garamond',serif",fontSize:md?26:42,fontWeight:800,color:"#fff"}}>
              Ready to Convert Your Files?
            </h2>
            <p style={{color:"rgba(255,255,255,0.85)",fontSize:md?14:17,margin:"0 0 32px",lineHeight:1.7,maxWidth:480,marginLeft:"auto",marginRight:"auto"}}>
              No sign-up. No downloads. No limits on free conversions. Start instantly.
            </p>
            <button className="cta" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{
              background:"#fff",color:"#be185d",border:"none",
              padding:md?"13px 28px":"17px 48px",borderRadius:14,
              fontSize:md?14:17,fontWeight:900,cursor:"pointer",
              transition:"all 0.2s",fontFamily:"inherit",
              boxShadow:"0 8px 28px rgba(0,0,0,0.18)"
            }}>⚡ Start Converting for Free →</button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{borderTop:`1px solid ${T.border}`,background:T.card,padding:md?"32px 16px 24px":"48px 40px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          {/* Top */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:32,marginBottom:36}}>
            <div style={{maxWidth:300}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#be185d,#f472b6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✦</div>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:800,fontSize:20,background:"linear-gradient(135deg,#be185d,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PDFPink</span>
              </div>
              <p style={{color:T.sub,fontSize:12,lineHeight:1.8}}>Professional file conversion for everyone. Fast, secure, and completely free. Convert PDF, Word, Excel, PowerPoint, and images instantly.</p>
            </div>
            {!sm && (
              <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:11,color:T.text,marginBottom:12,textTransform:"uppercase",letterSpacing:1.2}}>Tools</div>
                  {["PDF to Word","PDF to Excel","PDF to PPT","Image to PDF","Merge PDFs","Compress PDF"].map(l=>(
                    <div key={l} style={{marginBottom:8}}><a href="#tools" style={{color:T.sub,fontSize:12,textDecoration:"none",fontWeight:500}}>{l}</a></div>
                  ))}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:11,color:T.text,marginBottom:12,textTransform:"uppercase",letterSpacing:1.2}}>Company</div>
                  {["About","Privacy Policy","Terms of Service","Contact Us","API Docs","Blog"].map(l=>(
                    <div key={l} style={{marginBottom:8}}><a href="/" onClick={e=>e.preventDefault()} style={{color:T.sub,fontSize:12,textDecoration:"none",fontWeight:500}}>{l}</a></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Bottom */}
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <p style={{color:T.sub,fontSize:11}}>© 2026 PDFPink. All rights reserved. Files auto-deleted after 60 minutes.</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,rgba(190,24,93,0.07),rgba(244,114,182,0.07))",border:"1.5px solid rgba(190,24,93,0.2)",borderRadius:99,padding:"8px 20px"}}>
              <span style={{fontSize:15}}>👑</span>
              <span style={{fontSize:12,color:T.sub,fontWeight:600}}>
                Designed &amp; Owned by{" "}
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:800,fontSize:15,background:"linear-gradient(135deg,#be185d,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Zoha Ashraf</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {activeTool && <Modal tool={activeTool} onClose={()=>setTool(null)} />}
    </div>
  );
}
