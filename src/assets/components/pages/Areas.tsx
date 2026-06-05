import { useState } from 'react';
import './Areas.css';

// Interfaz para definir qué datos tiene un Área
interface Area {
  id: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
  questionCount: number;
}

export default function Areas() {
  // Estado para controlar la visibilidad del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos simulados (Mocks) que luego vendrán de tu API
  const mockAreas: Area[] = [
    { id: '1', name: 'Matemáticas IV', description: 'Álgebra, geometría y trigonometría avanzada.', status: 'Activo', questionCount: 245 },
    { id: '2', name: 'Historia Universal', description: 'Desde la prehistoria hasta la edad contemporánea.', status: 'Activo', questionCount: 180 },
    { id: '3', name: 'Física Cuántica', description: 'Curso introductorio (Malla curricular antigua).', status: 'Inactivo', questionCount: 42 },
  ];

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="areas-container">
      {/* Cabecera */}
      <div className="page-header">
        <h2 className="page-title">Gestión de Áreas</h2>
        <button className="btn-primary" onClick={handleOpenModal}>
          <span className="material-icons-outlined">add</span>
          Nueva Área
        </button>
      </div>

      {/* Tabla de Datos */}
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
            {mockAreas.map((area) => (
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
                    <button className="btn-icon" title="Editar" onClick={handleOpenModal}>
                      <span className="material-icons-outlined">edit</span>
                    </button>
                    <button className="btn-icon delete" title="Eliminar">
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CREACIÓN/EDICIÓN (Solo se renderiza si isModalOpen es true) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crear/Editar Área</h3>
              <button className="btn-icon" onClick={handleCloseModal}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="areaName">Nombre del Área *</label>
                <input type="text" id="areaName" className="form-control" placeholder="Ej. Biología Celular" />
              </div>
              <div className="form-group">
                <label htmlFor="areaDesc">Descripción</label>
                <textarea id="areaDesc" className="form-control" placeholder="Breve descripción del área..."></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-primary" onClick={handleCloseModal}>Guardar Área</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}