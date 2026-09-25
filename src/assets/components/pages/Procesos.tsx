import { useState } from 'react';
import { demoStore, type ExamProcess } from '../../../demoStore';
import './Procesos.css';

export default function Procesos() {
  const [processes, setProcesses] = useState<ExamProcess[]>(() => demoStore.getProcesses());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', course: '', period: '2026-II', responsible: '', date: new Date().toISOString().slice(0, 10) });

  const save = () => {
    if (!form.name.trim() || !form.course.trim()) {
      alert('Ingresa al menos el nombre del proceso y el curso.');
      return;
    }
    const item: ExamProcess = {
      id: Date.now().toString(),
      ...form,
      status: 'Borrador',
      createdAt: new Date().toISOString(),
    };
    const next = [item, ...processes];
    setProcesses(next);
    demoStore.saveProcesses(next);
    setOpen(false);
    setForm({ name: '', course: '', period: '2026-II', responsible: '', date: new Date().toISOString().slice(0, 10) });
  };

  const toggleReady = (id: string) => {
    const next = processes.map((p) => p.id === id ? { ...p, status: p.status === 'Listo' ? 'Borrador' : 'Listo' as 'Borrador' | 'Listo' } : p);
    setProcesses(next);
    demoStore.saveProcesses(next);
  };

  return (
    <div className="procesos-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Procesos de Examen</h2>
          <p className="page-subtitle">Crea el proceso que servirá como base para la generación del examen.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><span className="material-icons-outlined">add</span>Nuevo proceso</button>
      </div>

      <div className="process-grid">
        {processes.map((p) => (
          <article className="process-card" key={p.id}>
            <div className="process-card-top">
              <span className={`process-status ${p.status === 'Listo' ? 'ready' : ''}`}>{p.status}</span>
              <span className="material-icons-outlined">assignment</span>
            </div>
            <h3>{p.name}</h3>
            <p><strong>Curso:</strong> {p.course}</p>
            <p><strong>Periodo:</strong> {p.period}</p>
            <p><strong>Fecha:</strong> {p.date}</p>
            {p.responsible && <p><strong>Responsable:</strong> {p.responsible}</p>}
            <button className="btn-outline process-action" onClick={() => toggleReady(p.id)}>
              {p.status === 'Listo' ? 'Volver a borrador' : 'Marcar como listo'}
            </button>
          </article>
        ))}
        {processes.length === 0 && (
          <div className="empty-process">
            <span className="material-icons-outlined">assignment_add</span>
            <h3>Aún no hay procesos</h3>
            <p>Crea uno para iniciar el flujo de demostración.</p>
          </div>
        )}
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header"><h3>Nuevo proceso de examen</h3><button className="btn-icon" onClick={() => setOpen(false)}><span className="material-icons-outlined">close</span></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Nombre del proceso *</label><input className="form-control" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Ej. Examen parcial de Matemáticas" /></div>
              <div className="form-group"><label>Curso *</label><input className="form-control" value={form.course} onChange={(e)=>setForm({...form,course:e.target.value})} placeholder="Ej. Matemáticas IV" /></div>
              <div className="form-row">
                <div className="form-group mb-0"><label>Periodo</label><input className="form-control" value={form.period} onChange={(e)=>setForm({...form,period:e.target.value})} /></div>
                <div className="form-group mb-0"><label>Fecha del examen</label><input type="date" className="form-control" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Responsable</label><input className="form-control" value={form.responsible} onChange={(e)=>setForm({...form,responsible:e.target.value})} placeholder="Docente o coordinador" /></div>
            </div>
            <div className="modal-footer"><button className="btn-outline" onClick={()=>setOpen(false)}>Cancelar</button><button className="btn-primary" onClick={save}>Guardar proceso</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
