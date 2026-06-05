import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Agregamos la propiedad 'path' a la interfaz
interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: string;
}

export default function Sidebar() {
  // Ya no necesitamos el useState, React Router controla qué pestaña está activa automáticamente

  const menuItems: MenuItem[] = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'areas', path: '/areas', label: 'Gestión de Áreas', icon: 'grid_view' },
    { id: 'banco', path: '/banco', label: 'Banco de Preguntas', icon: 'storage' },
    { id: 'importar', path: '/importar', label: 'Importar Preguntas', icon: 'upload_file' },
    { id: 'generar', path: '/generar', label: 'Generar Exámenes', icon: 'note_add' },
    { id: 'historial', path: '/historial', label: 'Historial de Exámenes', icon: 'history' },
    { id: 'configuracion', path: '/configuracion', label: 'Configuración', icon: 'settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <span className="material-icons-outlined logo-icon">receipt_long</span>
        <h1 className="logo-text">
          Sistema de Gestión<br />de Exámenes
        </h1>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          // Usamos NavLink, que nos da la clase 'isActive' mágicamente si la URL coincide
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="material-icons-outlined">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}