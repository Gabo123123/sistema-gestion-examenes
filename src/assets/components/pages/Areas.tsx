import { useMemo, useState } from 'react';
import { demoStore, type Area } from '../../../demoStore';
import './Areas.css';

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>(() => demoStore.getAreas());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const questions = demoStore.getQuestions();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    questions.forEach((q) => { map[q.area] = (map[q.area] || 0) + 1; });
    return map;
  }, [questions]);

  const persist = (next: Area[]) => {
    setAreas(next);
    demoStore.saveAreas(next);
  };

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setStatus('Activo');
    setIsModalOpen(true);
  };

  const openEdit = (area: Area) => {
    setEditingId(area.id);
    setName(area.name);
    setDescription(area.description);
    setStatus(area.status);
    setIsModalOpen(true);
  };

  const save = () => {
    if (!name.trim()) {
      alert('Ingresa el nombre del área.');
      return;
    }
    if (editingId) {
      persist(areas.map((a) => a.id === editingId ? { ...a, name: name.trim(), description, status } : a));
    } else {
      persist([...areas, { id: Date.now().toString(), name: name.trim(), description, status }]);
    }
    setIsModalOpen(false);
  };

  const remove = (area: Area) => {
    const count = counts[area.name] || 0;
    if (count > 0) {
      alert('No se puede eliminar un área que aún tiene preguntas asociadas en esta demo.');
      return;
    }
    if (window.confirm('¿Eliminar esta área?')) persist(areas.filter((a) => a.id !== area.id));
  };

  return (
    <div className="areas-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestión de Áreas</h2>
          <p style={{ margin: '6px 0 0', color: '#5f6368', fontSize: 13 }}>Los cambios quedan guardados en este navegador para la demostración.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><span className="material-icons-outlined">add</span>Nueva Área</button>
      </div>

      <div className="table-card">
        <table>
          <thead><tr><th>Nombre del Área</th><th>Descripción</th><th>Estado</th><th>Total Preguntas</th><th>Acciones</th></tr></thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td><strong>{area.name}</strong></td>
                <td>{area.description || '—'}</td>
                <td><span className={`badge ${area.status === 'Activo' ? 'badge-active' : 'badge-inactive'}`}>{area.status}</span></td>
                <td>{counts[area.name] || 0}</td>
                <td><div className="action-buttons">
                  <button className="btn-icon" title="Editar" onClick={() => openEdit(area)}><span className="material-icons-outlined">edit</span></button>
                  <button className="btn-icon delete" title="Eliminar" onClick={() => remove(area)}><span className="material-icons-outlined">delete</span></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header"><h3>{editingId ? 'Editar Área' : 'Crear Nueva Área'}</h3><button className="btn-icon" onClick={()=>setIsModalOpen(false)}><span className="material-icons-outlined">close</span></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Nombre del Área *</label><input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} /></div>
              <div className="form-group"><label>Descripción</label><textarea className="form-control" value={description} onChange={(e)=>setDescription(e.target.value)} /></div>
              <div className="form-group"><label>Estado</label><select className="form-control" value={status} onChange={(e)=>setStatus(e.target.value as 'Activo'|'Inactivo')}><option>Activo</option><option>Inactivo</option></select></div>
            </div>
            <div className="modal-footer"><button className="btn-outline" onClick={()=>setIsModalOpen(false)}>Cancelar</button><button className="btn-primary" onClick={save}>Guardar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
