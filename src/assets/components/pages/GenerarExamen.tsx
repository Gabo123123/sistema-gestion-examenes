import { useState } from 'react';
import './GenerarExamen.css';

// 1. Ampliamos la interfaz para desglosar la disponibilidad por dificultad
interface AreaData {
  id: string;
  name: string;
  category: string;
  available: {
    facil: number;
    medio: number;
    dificil: number;
  };
}

// Interfaz para el estado de cantidades solicitadas
interface Quantities {
  facil: number;
  medio: number;
  dificil: number;
}

export default function GenerarExamen() {
  // 2. Base de datos con el desglose real de preguntas
  const [areas] = useState<AreaData[]>([
    { id: '1', name: 'Matemáticas IV', category: 'Ingeniería', available: { facil: 100, medio: 100, dificil: 45 } },
    { id: '2', name: 'Física Cuántica', category: 'Ingeniería', available: { facil: 12, medio: 20, dificil: 10 } },
    { id: '3', name: 'Anatomía Humana', category: 'Salud', available: { facil: 50, medio: 40, dificil: 30 } },
    { id: '4', name: 'Biología Celular', category: 'Salud', available: { facil: 30, medio: 30, dificil: 25 } },
    { id: '5', name: 'Historia Universal', category: 'Humanidades', available: { facil: 80, medio: 70, dificil: 30 } },
    { id: '6', name: 'Lenguaje y Literatura', category: 'Humanidades', available: { facil: 100, medio: 80, dificil: 30 } },
  ]);

  const [numVersions, setNumVersions] = useState<number>(1);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('Todas');

  const [selectedCourses, setSelectedCourses] = useState<Record<string, boolean>>({});
  
  // 3. El estado ahora guarda un objeto con las 3 dificultades por cada curso
  const [quantities, setQuantities] = useState<Record<string, Quantities>>({});

  const handleToggleCourse = (id: string, checked: boolean) => {
    setSelectedCourses((prev) => ({ ...prev, [id]: checked }));
    
    // Si activa el curso, inicializamos en 0. Si lo desactiva, reseteamos a 0.
    setQuantities((prev) => ({
      ...prev,
      [id]: { facil: 0, medio: 0, dificil: 0 }
    }));
  };

  const handleQuantityChange = (id: string, level: keyof Quantities, value: string) => {
    const val = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { facil: 0, medio: 0, dificil: 0 }),
        [level]: isNaN(val) ? 0 : val
      }
    }));
  };

  let totalSelected = 0;
  let hasErrors = false;

  // 4. Procesamos los datos validando cada dificultad por separado
  const processedAreas = areas.map((area) => {
    const isSelected = selectedCourses[area.id] || false;
    const req = quantities[area.id] || { facil: 0, medio: 0, dificil: 0 };
    
    const subtotal = req.facil + req.medio + req.dificil;
    if (isSelected) totalSelected += subtotal;
    
    // Validamos errores por nivel
    const errorFacil = isSelected && req.facil > area.available.facil;
    const errorMedio = isSelected && req.medio > area.available.medio;
    const errorDificil = isSelected && req.dificil > area.available.dificil;
    
    if (errorFacil || errorMedio || errorDificil) hasErrors = true;

    return { 
      ...area, 
      isSelected, 
      req, 
      subtotal,
      errors: { facil: errorFacil, medio: errorMedio, dificil: errorDificil } 
    };
  });

  const displayedAreas = processedAreas.filter(
    area => selectedFilterCategory === 'Todas' || area.category === selectedFilterCategory
  );

  const isGenerateDisabled = hasErrors || totalSelected === 0 || numVersions < 1;

  const handleGenerate = () => {
    if (isGenerateDisabled) return;
    const confirmacion = window.confirm(`Vas a generar ${numVersions} versión(es) de un examen con ${totalSelected} preguntas distribuidas por dificultad. ¿Deseas continuar?`);
    if (confirmacion) {
      alert('Simulando generación de examen...');
    }
  };

  return (
    <div className="generar-container">
      <div className="page-header">
        <h2 className="page-title">Generación de Exámenes</h2>
      </div>

      <div className="generator-layout">
        
        <div className="config-section">
          
          <div className="card">
            <h3 className="card-title"><span className="material-icons-outlined">settings</span> Parámetros del Examen</h3>
            <div className="config-grid">
              <div className="form-group">
                <label>Número de Versiones (Ilimitado)</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="card-title" style={{ marginBottom: '4px' }}>
                  <span className="material-icons-outlined">format_list_numbered</span> Selección de Preguntas
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Marca los cursos y distribuye la cantidad por nivel de dificultad.
                </p>
              </div>

              <div style={{ width: '250px' }}>
                <select 
                  className="form-control" 
                  value={selectedFilterCategory} 
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
                >
                  <option value="Todas">Mostrar todas las Áreas</option>
                  <option value="Ingeniería">Perfil: Ingeniería</option>
                  <option value="Salud">Perfil: Salud</option>
                  <option value="Humanidades">Perfil: Humanidades</option>
                </select>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th className="col-checkbox">Incluir</th>
                  <th>Curso / Área</th>
                  <th style={{ textAlign: 'right' }}>Distribución de Dificultad</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {displayedAreas.map((area) => (
                  <tr key={area.id} style={{ backgroundColor: area.isSelected ? '#f8fbff' : 'transparent' }}>
                    <td className="col-checkbox">
                      <input 
                        type="checkbox" 
                        className="row-checkbox"
                        checked={area.isSelected}
                        onChange={(e) => handleToggleCourse(area.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <strong style={{ color: area.isSelected ? 'var(--primary-blue)' : 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                        {area.name}
                      </strong>
                      <span className="category-badge">{area.category}</span>
                    </td>
                    
                    {/* NUEVO: Bloque de 3 inputs para la distribución */}
                    <td>
                      <div className="difficulty-group">
                        {/* Fácil */}
                        <div className="diff-item">
                          <span className="diff-label">Fácil</span>
                          <input 
                            type="number" 
                            className={`input-number-sm ${area.errors.facil ? 'input-error' : ''}`}
                            value={area.isSelected && area.req.facil ? area.req.facil : ''}
                            placeholder="0"
                            min="0"
                            disabled={!area.isSelected}
                            onChange={(e) => handleQuantityChange(area.id, 'facil', e.target.value)}
                          />
                          <span className={`diff-limit ${area.errors.facil ? 'error' : ''}`}>
                            Max: {area.available.facil}
                          </span>
                        </div>
                        
                        {/* Medio */}
                        <div className="diff-item">
                          <span className="diff-label">Medio</span>
                          <input 
                            type="number" 
                            className={`input-number-sm ${area.errors.medio ? 'input-error' : ''}`}
                            value={area.isSelected && area.req.medio ? area.req.medio : ''}
                            placeholder="0"
                            min="0"
                            disabled={!area.isSelected}
                            onChange={(e) => handleQuantityChange(area.id, 'medio', e.target.value)}
                          />
                          <span className={`diff-limit ${area.errors.medio ? 'error' : ''}`}>
                            Max: {area.available.medio}
                          </span>
                        </div>
                        
                        {/* Difícil */}
                        <div className="diff-item">
                          <span className="diff-label">Difícil</span>
                          <input 
                            type="number" 
                            className={`input-number-sm ${area.errors.dificil ? 'input-error' : ''}`}
                            value={area.isSelected && area.req.dificil ? area.req.dificil : ''}
                            placeholder="0"
                            min="0"
                            disabled={!area.isSelected}
                            onChange={(e) => handleQuantityChange(area.id, 'dificil', e.target.value)}
                          />
                          <span className={`diff-limit ${area.errors.dificil ? 'error' : ''}`}>
                            Max: {area.available.dificil}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <strong style={{ fontSize: '16px', color: area.isSelected && area.subtotal > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {area.isSelected ? area.subtotal : 0}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="summary-section">
          <div className="summary-card">
            <h3 className="card-title"><span className="material-icons-outlined">receipt_long</span> Resumen del Examen</h3>
            
            <div style={{ marginTop: '24px' }}>
              {processedAreas.map((area) => (
                area.subtotal > 0 && (
                  <div className="summary-row" key={area.id} style={{ color: (area.errors.facil || area.errors.medio || area.errors.dificil) ? 'var(--danger)' : 'inherit' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{area.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {area.req.facil} F - {area.req.medio} M - {area.req.dificil} D
                      </span>
                    </div>
                    <strong style={{ display: 'flex', alignItems: 'center' }}>{area.subtotal}</strong>
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