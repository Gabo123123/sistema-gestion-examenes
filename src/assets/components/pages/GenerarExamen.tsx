import { useMemo, useState } from 'react';
import { demoStore, type Question } from '../../../demoStore';
import './GenerarExamen.css';

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c] || c));
}

export default function GenerarExamen() {
  const processes = demoStore.getProcesses();
  const questions = demoStore.getQuestions();
  const [processId, setProcessId] = useState(processes[0]?.id || '');
  const [area, setArea] = useState('');
  const [numQuestions, setNumQuestions] = useState(Math.min(10, questions.length || 1));
  const [versions, setVersions] = useState(1);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [message, setMessage] = useState('');

  const selectedProcess = processes.find((p)=>p.id===processId);
  const availableQuestions = useMemo(() => questions.filter((q)=>!area || q.area===area), [questions, area]);
  const areas = Array.from(new Set(questions.map((q)=>q.area)));

  const generate = () => {
    if (!selectedProcess) {
      alert('Primero crea un proceso de examen.');
      return;
    }
    if (availableQuestions.length === 0) {
      alert('No hay preguntas disponibles para esta selección.');
      return;
    }

    const amount = Math.max(1, Math.min(numQuestions, availableQuestions.length));
    const pages: string[] = [];

    for (let v = 1; v <= versions; v++) {
      let selected = randomizeQuestions ? shuffled(availableQuestions).slice(0, amount) : availableQuestions.slice(0, amount);
      const content = selected.map((q: Question, index) => {
        const indexedOptions = q.options.map((o, i)=>({ ...o, originalIndex:i }));
        const opts = randomizeOptions ? shuffled(indexedOptions) : indexedOptions;
        return `<div class="question"><div class="q-title"><strong>${index+1}.</strong> ${escapeHtml(q.text)}</div><div class="options">${opts.map((o,i)=>`<div>${String.fromCharCode(65+i)}) ${escapeHtml(o.text)}</div>`).join('')}</div></div>`;
      }).join('');

      pages.push(`<section class="exam-page"><header><div><h1>${escapeHtml(selectedProcess.name)}</h1><p>${escapeHtml(selectedProcess.course)} · ${escapeHtml(selectedProcess.period)}</p></div><div class="version">VERSIÓN ${String.fromCharCode(64+v)}</div></header><div class="student"><span>Apellidos y nombres: __________________________________________</span><span>Fecha: ${escapeHtml(selectedProcess.date)}</span></div><hr/>${content}</section>`);
    }

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(selectedProcess.name)}</title><style>
      @page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#111;margin:0}.exam-page{page-break-after:always}.exam-page:last-child{page-break-after:auto}header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}h1{font-size:19px;margin:0 0 5px}header p{margin:0;color:#555;font-size:12px}.version{border:1px solid #111;padding:7px 10px;font-weight:700;font-size:12px}.student{display:flex;justify-content:space-between;gap:20px;font-size:12px;margin:14px 0}.question{margin:15px 0;break-inside:avoid}.q-title{font-size:13px;line-height:1.5}.options{margin:7px 0 0 22px;display:grid;gap:5px;font-size:12px}hr{border:0;border-top:1px solid #aaa}
    </style></head><body>${pages.join('')}<script>window.onload=()=>window.print();<\/script></body></html>`;

    const win = window.open('', '_blank');
    if (!win) {
      alert('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para esta demo.');
      return;
    }
    win.document.write(html);
    win.document.close();

    const history = demoStore.getHistory();
    demoStore.saveHistory([{ id:Date.now().toString(), processId:selectedProcess.id, processName:selectedProcess.name, versions, questionCount:amount, createdAt:new Date().toISOString() }, ...history]);
    setMessage(`Examen preparado con ${amount} preguntas y ${versions} versión(es). En la ventana de impresión selecciona “Guardar como PDF”.`);
  };

  return (
    <div className="generar-container">
      <div className="page-header"><div><h2 className="page-title">Generación de Exámenes</h2><p style={{margin:'6px 0 0',color:'#5f6368',fontSize:13}}>Genera el examen real de la demo y guárdalo como PDF desde el navegador.</p></div></div>

      {message && <div style={{marginBottom:20,padding:'14px 16px',border:'1px solid #b7dfc5',background:'#f0faf3',borderRadius:10,color:'#176b35'}}><strong>Listo.</strong> {message}</div>}

      <div className="generator-layout">
        <div className="config-section">
          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">assignment</span>Proceso</h3>
            <div className="form-group"><label>Proceso de examen</label><select className="form-control" value={processId} onChange={(e)=>setProcessId(e.target.value)}><option value="">Seleccione...</option>{processes.map((p)=><option key={p.id} value={p.id}>{p.name} — {p.course}</option>)}</select></div>
            {processes.length===0 && <p style={{fontSize:13,color:'#b06000'}}>No hay procesos. Crea uno desde “Procesos de Examen”.</p>}
          </div>

          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">tune</span>Configuración</h3>
            <div className="config-grid">
              <div className="form-group"><label>Área</label><select className="form-control" value={area} onChange={(e)=>setArea(e.target.value)}><option value="">Todas</option>{areas.map((a)=><option key={a}>{a}</option>)}</select></div>
              <div className="form-group"><label>Cantidad de preguntas</label><input className="form-control" type="number" min="1" max={availableQuestions.length || 1} value={numQuestions} onChange={(e)=>setNumQuestions(Number(e.target.value)||1)} /></div>
              <div className="form-group"><label>Número de versiones</label><input className="form-control" type="number" min="1" max="5" value={versions} onChange={(e)=>setVersions(Math.max(1,Math.min(5,Number(e.target.value)||1)))} /></div>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-label"><input type="checkbox" checked={randomizeQuestions} onChange={(e)=>setRandomizeQuestions(e.target.checked)} /> Aleatorizar preguntas</label>
              <label className="checkbox-label"><input type="checkbox" checked={randomizeOptions} onChange={(e)=>setRandomizeOptions(e.target.checked)} /> Aleatorizar alternativas</label>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">quiz</span>Preguntas disponibles</h3>
            <p style={{fontSize:13,color:'#5f6368'}}>Hay <strong>{availableQuestions.length}</strong> preguntas disponibles para la selección actual.</p>
          </div>
        </div>

        <div className="summary-section">
          <div className="summary-card">
            <h3 className="card-title"><span className="material-icons-outlined">description</span>Resumen</h3>
            <div className="summary-row"><span>Proceso</span><strong>{selectedProcess?.name || 'Sin seleccionar'}</strong></div>
            <div className="summary-row"><span>Preguntas</span><strong>{Math.min(numQuestions, availableQuestions.length)}</strong></div>
            <div className="summary-row"><span>Versiones</span><strong>{versions}</strong></div>
            <div className="summary-total"><span>Salida</span><span>PDF</span></div>
            <button className="btn-primary" disabled={!selectedProcess || availableQuestions.length===0} onClick={generate}><span className="material-icons-outlined">picture_as_pdf</span>Generar / Guardar PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
