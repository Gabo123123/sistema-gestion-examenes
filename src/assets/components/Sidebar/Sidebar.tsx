import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: string;
}

export default function Sidebar() {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', path: '/dashboard', label: 'Inicio Demo', icon: 'home' },
    { id: 'areas', path: '/areas', label: 'Gestión de Áreas', icon: 'grid_view' },
    { id: 'banco', path: '/banco', label: 'Banco de Preguntas', icon: 'storage' },
    { id: 'generar', path: '/generar', label: 'Generar Exámenes', icon: 'note_add' },
    { id: 'importar', path: '/importar', label: 'Importar Preguntas', icon: 'upload_file' },
    { id: 'historial', path: '/historial', label: 'Historial', icon: 'history' },
    { id: 'configuracion', path: '/configuracion', label: 'Configuración', icon: 'settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <span className="material-icons-outlined logo-icon">receipt_long</span>
        <div>
          <h1 className="logo-text">Sistema de Gestión<br />de Exámenes</h1>
          <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '10px', fontWeight: 700, color: '#1a73e8', letterSpacing: '.06em' }}>DEMO INSTITUCIONAL</span>
        </div>
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink key={item.id} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="material-icons-outlined">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '14px 10px 0', borderTop: '1px solid #eef0f2', fontSize: '11px', lineHeight: 1.5, color: '#80868b' }}>
        Prototipo funcional para evaluación académica e institucional.
      </div>
    </aside>
  );
}
