import { useState } from 'react';
import './Areas.css';

interface Area {
  id: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
  questionCount: number;
}

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>([
    { id: '1', name: 'Matemáticas IV', description: 'Álgebra, geometría y trigonometría avanzada.', status: 'Activo', questionCount: 245 },
    { id: '2', name: 'Historia Universal', description: 'Desde la prehistoria hasta la edad contemporánea.', status: 'Activo', questionCount: 180 },
    { id: '3', name: 'Física Cuántica', description: 'Curso introductorio (Malla curricular antigua).', status: 'Inactivo', questionCount: 42 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDesc, setNewAreaDesc] = useState('');
  
  // Estado para controlar si el select dice 'Activo' o 'Inactivo'
  const [newAreaStatus, setNewAreaStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setNewAreaName('');
    setNewAreaDesc('');
    setNewAreaStatus('Activo');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (area: Area) => {
    setEditingId(area.id);
    setNewAreaName(area.name);
    setNewAreaDesc(area.description);
    setNewAreaStatus(area.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAreaName('');
    setNewAreaDesc('');
    setNewAreaStatus('Activo');
    setEditingId(null);
  };

  const handleSaveArea = () => {
    if (newAreaName.trim() === '') {
      alert('Por favor, ingresa el nombre del área. Es obligatorio.');
      return;
    }

    if (editingId) {
      setAreas(areas.map((area) => 
        area.id === editingId 
          ? { ...area, name: newAreaName, description: newAreaDesc, status: newAreaStatus } 
          : area
      ));
    } else {
      const nuevaArea: Area = {
        id: Date.now().toString(),
        name: newAreaName,
        description: newAreaDesc,
        status: newAreaStatus,
        questionCount: 0,
      };
      setAreas([...areas, nuevaArea]);
    }
    
    handleCloseModal();
  };

  const handleDeleteArea = (id: string, questionCount: number) => {
    if (questionCount > 0) {
      const confirmacion = window.confirm(`Esta área tiene ${questionCount} preguntas asociadas. ¿Estás seguro de eliminarla?`);
      if (!confirmacion) return;
    }
    setAreas(areas.filter((area) => area.id !== id));
  };

  return (
    <div className="areas-container">
      <div className="page-header">
        <h2 className="page-title">Gestión de Áreas</h2>
        <button className="btn-primary" onClick={handleOpenCreateModal}>
          <span className="material-icons-outlined">add</span>
          Nueva Área
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nombre del Área</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Total Preguntas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td><strong>{area.name}</strong></td>
                <td>{area.description}</td>
                <td>
                  <span className={`badge ${area.status === 'Activo' ? 'badge-active' : 'badge-inactive'}`}>
                    {area.status}
                  </span>
                </td>
                <td>{area.questionCount}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      title="Editar" 
                      onClick={() => handleOpenEditModal(area)}
                    >
                      <span className="material-icons-outlined">edit</span>
                    </button>
                    <button 
                      className="btn-icon delete" 
                      title="Eliminar"
                      onClick={() => handleDeleteArea(area.id, area.questionCount)}
                    >
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {areas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No hay áreas registradas. Haz clic en "Nueva Área" para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Editar Área' : 'Crear Nueva Área'}</h3>
              <button className="btn-icon" onClick={handleCloseModal}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="areaName">Nombre del Área *</label>
                <input 
                  type="text" 
                  id="areaName" 
                  className="form-control" 
                  placeholder="Ej. Biología Celular"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="areaDesc">Descripción</label>
                <textarea 
                  id="areaDesc" 
                  className="form-control" 
                  placeholder="Breve descripción del área..."
                  value={newAreaDesc}
                  onChange={(e) => setNewAreaDesc(e.target.value)}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="areaStatus">Estado del Área</label>
                <select 
                  id="areaStatus" 
                  className="form-control"
                  value={newAreaStatus}
                  onChange={(e) => setNewAreaStatus(e.target.value as 'Activo' | 'Inactivo')}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveArea}>
                {editingId ? 'Guardar Cambios' : 'Guardar Área'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}