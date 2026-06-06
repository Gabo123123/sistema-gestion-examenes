import { useState } from 'react';
import './BancoPreguntas.css';

// Estructura actualizada para soportar imágenes en cada opción
interface Option {
  text: string;
  imageUrl: string;
}

interface Question {
  id: string;
  code: string;
  area: string;
  text: string;
  imageUrl?: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  options: Option[];
  correctOptionIndex: number;
}

export default function BancoPreguntas() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1', code: 'MAT-001', area: 'Matemáticas IV',
      text: 'Calcula la hipotenusa de un triángulo rectángulo cuyos catetos miden 3cm y 4cm respectivamente, aplicando el teorema de Pitágoras.',
      difficulty: 'Fácil',
      options: [
        { text: '6 cm', imageUrl: '' },
        { text: '5 cm', imageUrl: '' },
        { text: '7 cm', imageUrl: '' },
        { text: '12 cm', imageUrl: '' },
        { text: '9 cm', imageUrl: '' }
      ],
      correctOptionIndex: 1
    },
    {
      id: '2', code: 'HIS-042', area: 'Historia Universal',
      text: '¿Cuál de los siguientes eventos marcó el inicio oficial de la Revolución Francesa en 1789?',
      difficulty: 'Medio',
      options: [
        { text: 'La ejecución de Luis XVI', imageUrl: '' },
        { text: 'La coronación de Napoleón', imageUrl: '' },
        { text: 'La Toma de la Bastilla', imageUrl: '' },
        { text: 'El Juramento del Juego de Pelota', imageUrl: '' },
        { text: 'La Batalla de Waterloo', imageUrl: '' }
      ],
      correctOptionIndex: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    area: '',
    text: '',
    imageUrl: '',
    difficulty: 'Fácil' as 'Fácil' | 'Medio' | 'Difícil',
    options: [
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' }
    ],
    correctOptionIndex: 0
  });

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea ? q.area === filterArea : true;
    const matchesDiff = filterDifficulty ? q.difficulty === filterDifficulty : true;
    return matchesSearch && matchesArea && matchesDiff;
  });

  const handleOpenDetail = (question: Question) => {
    setSelectedQuestion(question);
    setIsAnswerRevealed(false);
  };

  const handleCloseDetail = () => {
    setSelectedQuestion(null);
    setIsAnswerRevealed(false);
  };

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormData({ 
      code: '', // Inicia vacío hasta que se elija un área
      area: '', 
      text: '', 
      imageUrl: '', 
      difficulty: 'Fácil', 
      options: [
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' }
      ], 
      correctOptionIndex: 0 
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (question: Question) => {
    setEditingId(question.id);
    // Hacemos una copia profunda de las opciones para no modificar el estado original por accidente
    const copiedOptions = question.options.map(opt => ({ ...opt }));
    
    setFormData({
      code: question.code,
      area: question.area,
      text: question.text,
      imageUrl: question.imageUrl || '',
      difficulty: question.difficulty,
      options: copiedOptions,
      correctOptionIndex: question.correctOptionIndex
    });
    setIsFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
  };

  // --- LÓGICA: GENERACIÓN DE CÓDIGO POR ÁREA ---
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArea = e.target.value;
    let newCode = '';
    
    if (selectedArea === 'Matemáticas IV') {
      newCode = `MAT-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
    } else if (selectedArea === 'Historia Universal') {
      newCode = `HIS-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
    }
    
    // Solo generamos un código nuevo si estamos CREANDO. Si estamos editando, se respeta el código antiguo.
    if (!editingId) {
      setFormData({ ...formData, area: selectedArea, code: newCode });
    } else {
      setFormData({ ...formData, area: selectedArea });
    }
  };

  // --- LÓGICA: IMÁGENES ---
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleOptionImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newOptions = [...formData.options];
      newOptions[index].imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSaveQuestion = () => {
    if (!formData.area || !formData.text) {
      alert('Por favor, selecciona un área y escribe el enunciado.');
      return;
    }
    if (formData.options.some(opt => opt.text.trim() === '' && opt.imageUrl === '')) {
      alert('Las 5 alternativas deben tener texto o una imagen.');
      return;
    }

    if (editingId) {
      setQuestions(questions.map(q => q.id === editingId ? { ...formData, id: editingId } : q));
    } else {
      const newQuestion: Question = { ...formData, id: Date.now().toString() };
      setQuestions([...questions, newQuestion]);
    }
    handleCloseForm();
  };

  const getDifficultyBadgeClass = (diff: string) => {
    if (diff === 'Fácil') return 'badge-easy';
    if (diff === 'Medio') return 'badge-medium';
    return 'badge-hard';
  };

  return (
    <div className="banco-container">
      <div className="page-header">
        <h2 className="page-title">Banco de Preguntas</h2>
        <div className="header-actions">
          <button className="btn-outline">
            <span className="material-icons-outlined">upload_file</span>
            Importar
          </button>
          <button className="btn-primary" onClick={handleOpenCreateForm}>
            <span className="material-icons-outlined">add</span>
            Nueva Pregunta
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <input 
          type="text" 
          className="filter-input" 
          placeholder="Buscar por código o palabra clave..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
          <option value="">Todas las Áreas</option>
          <option value="Matemáticas IV">Matemáticas IV</option>
          <option value="Historia Universal">Historia Universal</option>
        </select>
        <select className="filter-select" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
          <option value="">Dificultad</option>
          <option value="Fácil">Fácil</option>
          <option value="Medio">Medio</option>
          <option value="Difícil">Difícil</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Área</th>
              <th>Enunciado (Resumen)</th>
              <th>Dificultad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id}>
                <td><strong>{q.code}</strong></td>
                <td>{q.area}</td>
                <td className="truncate-text" title={q.text}>{q.text}</td>
                <td><span className={`badge ${getDifficultyBadgeClass(q.difficulty)}`}>{q.difficulty}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver Detalle" onClick={() => handleOpenDetail(q)}>
                      <span className="material-icons-outlined">visibility</span>
                    </button>
                    <button className="btn-icon" title="Editar" onClick={() => handleOpenEditForm(q)}>
                      <span className="material-icons-outlined">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MODAL DE FORMULARIO (CREAR / EDITAR)
          ========================================= */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}</h3>
              <button className="btn-icon" onClick={handleCloseForm}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group mb-0">
                  <label>Área *</label>
                  {/* Conectamos el select a la función que genera el código */}
                  <select className="form-control" value={formData.area} onChange={handleAreaChange}>
                    <option value="">Seleccione...</option>
                    <option value="Matemáticas IV">Matemáticas IV</option>
                    <option value="Historia Universal">Historia Universal</option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label>Código (Autogenerado) *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.code} 
                    placeholder="Seleccione un área primero"
                    disabled 
                    style={{ backgroundColor: '#f1f3f4', cursor: 'not-allowed', color: formData.code ? '#1a73e8' : '#5f6368', fontWeight: '600' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Enunciado *</label>
                <textarea className="form-control" placeholder="Escribe la pregunta aquí..." value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Imagen de apoyo (Opcional)</label>
                {!formData.imageUrl ? (
                  <input type="file" className="form-control file-input-small" accept="image/*" onChange={handleMainImageUpload} />
                ) : (
                  <div>
                    <div className="image-preview-container">
                      <img src={formData.imageUrl} alt="Vista previa" className="image-preview" />
                      <button className="btn-remove-image" onClick={() => setFormData({...formData, imageUrl: ''})} title="Quitar imagen">
                        <span className="material-icons-outlined" style={{ fontSize: '16px' }}>close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Alternativas *</label>
                <div className="options-container">
                  {formData.options.map((opt, idx) => (
                    <div className="option-input-group" key={idx} style={{ alignItems: 'flex-start' }}>
                      <span className="option-letter" style={{ marginTop: '10px' }}>{String.fromCharCode(65 + idx)})</span>
                      
                      <div className="option-input-wrapper">
                        {/* Texto de la alternativa */}
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder={`Texto de la alternativa ${String.fromCharCode(65 + idx)}`}
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        />
                        
                        {/* Botón para subir imagen de la alternativa */}
                        {!opt.imageUrl ? (
                           <input type="file" accept="image/*" className="file-input-small" onChange={(e) => handleOptionImageUpload(idx, e)} />
                        ) : (
                           <div className="image-preview-container" style={{ marginTop: 0 }}>
                             <img src={opt.imageUrl} className="image-preview" style={{ maxHeight: '60px' }} alt={`Alternativa ${idx}`} />
                             <button 
                               className="btn-remove-image" 
                               onClick={() => {
                                 const newOptions = [...formData.options];
                                 newOptions[idx].imageUrl = '';
                                 setFormData({ ...formData, options: newOptions });
                               }}
                             >
                               <span className="material-icons-outlined" style={{ fontSize: '14px' }}>close</span>
                             </button>
                           </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group mb-0">
                  <label>Respuesta Correcta *</label>
                  <select className="form-control" value={formData.correctOptionIndex} onChange={e => setFormData({...formData, correctOptionIndex: Number(e.target.value)})}>
                    {formData.options.map((_, idx) => (
                      <option key={idx} value={idx}>Opción {String.fromCharCode(65 + idx)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label>Dificultad *</label>
                  <select className="form-control" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})}>
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={handleCloseForm}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveQuestion}>Guardar Pregunta</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE DETALLE (Visualización Segura)
          ========================================= */}
      {selectedQuestion && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Detalle de la Pregunta</h3>
              <button className="btn-icon" onClick={handleCloseDetail}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="question-meta">
                <span className={`badge ${getDifficultyBadgeClass(selectedQuestion.difficulty)}`}>{selectedQuestion.difficulty}</span>
                <span style={{ fontSize: '13px', color: '#5f6368', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>grid_view</span>
                  {selectedQuestion.area} ({selectedQuestion.code})
                </span>
              </div>

              <div className="question-text">{selectedQuestion.text}</div>

              {selectedQuestion.imageUrl && (
                <img src={selectedQuestion.imageUrl} alt="Apoyo visual" className="question-image" />
              )}

              <ul className="options-list">
                {selectedQuestion.options.map((opt, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isCorrect = index === selectedQuestion.correctOptionIndex;
                  const itemClass = isAnswerRevealed && isCorrect ? 'option-item correct' : 'option-item';
                  return (
                    <li key={index} className={itemClass}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div><span className="option-letter">{letter})</span> {opt.text}</div>
                        {/* Se muestra la imagen de la alternativa si existe */}
                        {opt.imageUrl && <img src={opt.imageUrl} alt={`Opción ${letter}`} className="option-image" />}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {!isAnswerRevealed ? (
                <div className="hidden-answer-box">
                  <span className="material-icons-outlined" style={{ fontSize: '32px', color: '#9aa0a6' }}>lock</span>
                  <p>La respuesta correcta está oculta por seguridad.</p>
                  <button className="btn-outline" style={{ marginTop: '8px' }} onClick={() => setIsAnswerRevealed(true)}>
                    <span className="material-icons-outlined">visibility</span>
                    Revelar Respuesta
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button className="btn-outline" onClick={() => setIsAnswerRevealed(false)}>
                    <span className="material-icons-outlined">visibility_off</span>
                    Ocultar Respuesta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}