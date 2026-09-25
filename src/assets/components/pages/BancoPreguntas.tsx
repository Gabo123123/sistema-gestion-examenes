import { useMemo, useState } from 'react';
import { demoStore, type Difficulty, type Question } from '../../../demoStore';
import './BancoPreguntas.css';

const blankOptions = () => Array.from({ length: 5 }, () => ({ text: '' }));

export default function BancoPreguntas() {
  const areas = demoStore.getAreas().filter((a) => a.status === 'Activo');
  const [questions, setQuestions] = useState<Question[]>(() => demoStore.getQuestions());
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [selected, setSelected] = useState<Question | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question,'id'>>({
    code: '', area: '', text: '', difficulty: 'Fácil', options: blankOptions(), correctOptionIndex: 0
  });

  const filtered = useMemo(() => questions.filter((q) =>
    (!filterArea || q.area === filterArea) &&
    (q.code.toLowerCase().includes(search.toLowerCase()) || q.text.toLowerCase().includes(search.toLowerCase()))
  ), [questions, filterArea, search]);

  const createCode = (areaName: string) => {
    const prefix = areaName.split(/\s+/).map((x)=>x[0]).join('').slice(0,3).toUpperCase() || 'PRE';
    return `${prefix}-${String(Date.now()).slice(-5)}`;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ code:'', area:'', text:'', difficulty:'Fácil', options:blankOptions(), correctOptionIndex:0 });
    setOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({ code:q.code, area:q.area, text:q.text, difficulty:q.difficulty, options:q.options.map(o=>({...o})), correctOptionIndex:q.correctOptionIndex });
    setOpen(true);
  };

  const save = () => {
    if (!form.area || !form.text.trim() || form.options.some((o)=>!o.text.trim())) {
      alert('Completa el área, el enunciado y las 5 alternativas.');
      return;
    }
    let next: Question[];
    if (editingId) {
      next = questions.map((q)=>q.id===editingId ? { ...form, id: editingId } : q);
    } else {
      next = [...questions, { ...form, id:Date.now().toString(), code: form.code || createCode(form.area) }];
    }
    setQuestions(next);
    demoStore.saveQuestions(next);
    setOpen(false);
  };

  const remove = (id: string) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    const next = questions.filter((q)=>q.id!==id);
    setQuestions(next);
    demoStore.saveQuestions(next);
  };

  return (
    <div className="banco-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Banco de Preguntas</h2>
          <p style={{ margin:'6px 0 0', color:'#5f6368', fontSize:13 }}>Crea preguntas que luego serán utilizadas en la generación del examen.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><span className="material-icons-outlined">add</span>Nueva Pregunta</button>
      </div>

      <div className="filters-bar">
        <input className="filter-input" placeholder="Buscar por código o palabra..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select className="filter-select" value={filterArea} onChange={(e)=>setFilterArea(e.target.value)}>
          <option value="">Todas las Áreas</option>
          {areas.map((a)=><option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead><tr><th>Código</th><th>Área</th><th>Enunciado</th><th>Dificultad</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map((q)=>(
              <tr key={q.id}>
                <td><strong>{q.code}</strong></td><td>{q.area}</td><td className="truncate-text">{q.text}</td><td><span className="badge">{q.difficulty}</span></td>
                <td><div className="action-buttons">
                  <button className="btn-icon" title="Ver" onClick={()=>setSelected(q)}><span className="material-icons-outlined">visibility</span></button>
                  <button className="btn-icon" title="Editar" onClick={()=>openEdit(q)}><span className="material-icons-outlined">edit</span></button>
                  <button className="btn-icon delete" title="Eliminar" onClick={()=>remove(q.id)}><span className="material-icons-outlined">delete</span></button>
                </div></td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={5} style={{textAlign:'center',padding:30,color:'#777'}}>No hay preguntas para mostrar.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-overlay"><div className="modal-content" style={{maxHeight:'90vh',overflowY:'auto'}}>
          <div className="modal-header"><h3>{editingId?'Editar Pregunta':'Nueva Pregunta'}</h3><button className="btn-icon" onClick={()=>setOpen(false)}><span className="material-icons-outlined">close</span></button></div>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group mb-0"><label>Área *</label><select className="form-control" value={form.area} onChange={(e)=>setForm({...form,area:e.target.value,code:editingId?form.code:createCode(e.target.value)})}><option value="">Seleccione...</option>{areas.map((a)=><option key={a.id}>{a.name}</option>)}</select></div>
              <div className="form-group mb-0"><label>Código</label><input className="form-control" value={form.code} disabled /></div>
            </div>
            <div className="form-group"><label>Enunciado *</label><textarea className="form-control" value={form.text} onChange={(e)=>setForm({...form,text:e.target.value})} /></div>
            <div className="form-group"><label>Dificultad</label><select className="form-control" value={form.difficulty} onChange={(e)=>setForm({...form,difficulty:e.target.value as Difficulty})}><option>Fácil</option><option>Medio</option><option>Difícil</option></select></div>
            <div className="form-group"><label>Alternativas *</label>
              {form.options.map((opt,i)=><div className="option-input-group" key={i}><span className="option-letter">{String.fromCharCode(65+i)})</span><input className="form-control" value={opt.text} onChange={(e)=>{const opts=form.options.map((o,idx)=>idx===i?{...o,text:e.target.value}:o);setForm({...form,options:opts});}} /></div>)}
            </div>
            <div className="form-group"><label>Respuesta correcta</label><select className="form-control" value={form.correctOptionIndex} onChange={(e)=>setForm({...form,correctOptionIndex:Number(e.target.value)})}>{form.options.map((_,i)=><option key={i} value={i}>Opción {String.fromCharCode(65+i)}</option>)}</select></div>
          </div>
          <div className="modal-footer"><button className="btn-outline" onClick={()=>setOpen(false)}>Cancelar</button><button className="btn-primary" onClick={save}>Guardar Pregunta</button></div>
        </div></div>
      )}

      {selected && (
        <div className="modal-overlay"><div className="modal-content">
          <div className="modal-header"><h3>{selected.code}</h3><button className="btn-icon" onClick={()=>setSelected(null)}><span className="material-icons-outlined">close</span></button></div>
          <div className="modal-body">
            <p><strong>{selected.area}</strong> · {selected.difficulty}</p>
            <div className="question-text">{selected.text}</div>
            <ul className="options-list">{selected.options.map((o,i)=><li key={i} className={i===selected.correctOptionIndex?'option-item correct':'option-item'}><strong>{String.fromCharCode(65+i)})</strong> {o.text}</li>)}</ul>
          </div>
        </div></div>
      )}
    </div>
  );
}
