import { useState } from 'react';
import './GenerarExamen.css';

// Simulamos los datos de las áreas que vendrían del backend
interface AreaData {
  id: string;
  name: string;
  available: number;
}

export default function GenerarExamen() {
  const [areas] = useState<AreaData[]>([
    { id: '1', name: 'Matemáticas IV', available: 245 },
    { id: '2', name: 'Historia Universal', available: 180 },
    { id: '3', name: 'Física Cuántica', available: 42 },
  ]);

  // Estados de configuración general (Versiones sin límite)
  const [numVersions, setNumVersions] = useState<number>(1);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);

  // Estado para guardar cuántas preguntas pide el usuario por cada área
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, value: string) => {
    const val = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(val) ? 0 : val, // Si borra el input, se vuelve 0
    }));
  };

  // Variables calculadas en tiempo real para el resumen
  let totalSelected = 0;
  let hasErrors = false;

  const areasConCantidades = areas.map((area) => {
    const requested = quantities[area.id] || 0;
    totalSelected += requested;
    
    // Regla de negocio: Validar que no se pidan más de las disponibles
    const isError = requested > area.available;
    if (isError) hasErrors = true;

    return { ...area, requested, isError };
  });

  // Validaciones para habilitar/deshabilitar el botón final
  const isGenerateDisabled = hasErrors || totalSelected === 0 || numVersions < 1;

  const handleGenerate = () => {
    if (isGenerateDisabled) return;
    
    const confirmacion = window.confirm(`Vas a generar ${numVersions} versión(es) de un examen con ${totalSelected} preguntas en total. ¿Deseas continuar?`);
    if (confirmacion) {
      alert('Simulando generación de examen...');
      // Aquí se enviaría el JSON al backend y se redirigiría a la vista previa
    }
  };

  return (
    <div className="generar-container">
      <div className="page-header">
        <h2 className="page-title">Generación de Exámenes</h2>
      </div>

      <div className="generator-layout">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="config-section">
          
          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">settings</span> Parámetros del Examen</h3>
            <div className="config-grid">
              <div className="form-group">
                <label>Número de Versiones (Ilimitado)</label>
                {/* Modificado a input libre según requerimiento */}
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" 
                  value={numVersions}
                  onChange={(e) => setNumVersions(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  /> 
                  Aleatorizar orden de preguntas
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={randomizeOptions}
                    onChange={(e) => setRandomizeOptions(e.target.checked)}
                  /> 
                  Aleatorizar alternativas (A, B, C...)
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">format_list_numbered</span> Selección de Preguntas</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Ingresa la cantidad de preguntas que deseas incluir por cada área.
            </p>
            
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th style={{ textAlign: 'center' }}>Disponibles en Banco</th>
                  <th style={{ textAlign: 'right' }}>Cantidad Solicitada</th>
                </tr>
              </thead>
              <tbody>
                {areasConCantidades.map((area) => (
                  <tr key={area.id}>
                    <td><strong>{area.name}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: area.available > 0 ? 'var(--success-text)' : 'var(--text-muted)', fontWeight: 500 }}>
                        {area.available}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <input 
                        type="number" 
                        className={`input-number ${area.isError ? 'input-error' : ''}`} 
                        value={quantities[area.id] || ''} 
                        min="0"
                        placeholder="0"
                        onChange={(e) => handleQuantityChange(area.id, e.target.value)}
                      />
                      {area.isError && (
                        <span className="error-text">Supera el límite ({area.available})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* COLUMNA DERECHA (RESUMEN EN TIEMPO REAL) */}
        <div className="summary-section">
          <div className="summary-card">
            <h3 className="card-title"><span className="material-icons-outlined">receipt_long</span> Resumen del Examen</h3>
            
            <div style={{ marginTop: '24px' }}>
              {areasConCantidades.map((area) => (
                area.requested > 0 && (
                  <div className="summary-row" key={area.id} style={{ color: area.isError ? 'var(--danger)' : 'inherit' }}>
                    <span>{area.name}</span>
                    <strong>{area.requested}</strong>
                  </div>
                )
              ))}
              {totalSelected === 0 && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                  Aún no has seleccionado preguntas.
                </div>
              )}
            </div>

            <div className="summary-total">
              <span>Total de Preguntas</span>
              <span style={{ color: hasErrors ? 'var(--danger)' : 'var(--text-main)' }}>
                {totalSelected}
              </span>
            </div>

            {hasErrors && (
              <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '12px', textAlign: 'center' }}>
                Corrige las cantidades en rojo para continuar.
              </p>
            )}

            <button 
              className={`btn-primary ${isGenerateDisabled ? 'btn-disabled' : ''}`} 
              disabled={isGenerateDisabled}
              onClick={handleGenerate}
            >
              <span className="material-icons-outlined">note_add</span>
              Generar Examen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}