import { Link } from 'react-router-dom';
import './Dashboard.css';

const stats = [
  { label: 'Áreas registradas', value: '6', icon: 'grid_view' },
  { label: 'Preguntas disponibles', value: '827', icon: 'quiz' },
  { label: 'Exámenes generados', value: '24', icon: 'description' },
  { label: 'Versiones creadas', value: '58', icon: 'content_copy' },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <section className="demo-banner">
        <div>
          <span className="demo-badge">DEMO INSTITUCIONAL</span>
          <h2>Sistema de Gestión y Creación de Exámenes</h2>
          <p>
            Prototipo funcional para evaluar la factibilidad de gestión de preguntas,
            organización por áreas y generación de múltiples versiones de examen.
          </p>
        </div>
        <Link to="/generar" className="demo-primary-link">
          <span className="material-icons-outlined">play_arrow</span>
          Probar generación
        </Link>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <span className="material-icons-outlined stat-icon">{item.icon}</span>
            <div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="eyebrow">RECORRIDO SUGERIDO</span>
              <h3>Prueba el flujo principal</h3>
            </div>
          </div>

          <div className="flow-list">
            <Link to="/procesos" className="flow-item">
              <span className="flow-number">1</span>
              <div>
                <strong>Crear el proceso de examen</strong>
                <p>Primero crea un proceso y luego organiza las áreas académicas del banco.</p>
              </div>
              <span className="material-icons-outlined">chevron_right</span>
            </Link>

            <Link to="/banco" className="flow-item">
              <span className="flow-number">2</span>
              <div>
                <strong>Crear o revisar preguntas</strong>
                <p>Visualiza preguntas, alternativas, dificultad y respuesta correcta.</p>
              </div>
              <span className="material-icons-outlined">chevron_right</span>
            </Link>

            <Link to="/generar" className="flow-item">
              <span className="flow-number">3</span>
              <div>
                <strong>Generar un examen</strong>
                <p>Selecciona el proceso, preguntas y versiones; luego guarda el resultado como PDF.</p>
              </div>
              <span className="material-icons-outlined">chevron_right</span>
            </Link>
          </div>
        </article>

        <article className="dashboard-card scope-card">
          <span className="eyebrow">ALCANCE DE LA DEMO</span>
          <h3>¿Qué permite validar?</h3>
          <ul>
            <li><span className="material-icons-outlined">check_circle</span> Organización académica por áreas.</li>
            <li><span className="material-icons-outlined">check_circle</span> Administración básica de preguntas.</li>
            <li><span className="material-icons-outlined">check_circle</span> Distribución por nivel de dificultad.</li>
            <li><span className="material-icons-outlined">check_circle</span> Generación de varias versiones.</li>
            <li><span className="material-icons-outlined">check_circle</span> Aleatorización de preguntas y alternativas.</li>
          </ul>
          <div className="demo-note">
            Esta versión utiliza datos de demostración y está orientada a validar el flujo
            funcional antes de una integración institucional.
          </div>
        </article>
      </section>
    </div>
  );
}
