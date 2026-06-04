import { useState } from 'react';
import './Sidebar.css';

// 1. Definimos la interfaz para los elementos del menú
interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export default function Sidebar() {
  // 2. Tipamos el estado como string
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // 3. Aplicamos la interfaz al array
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'areas', label: 'Gestión de Áreas', icon: 'grid_view' },
    { id: 'banco', label: 'Banco de Preguntas', icon: 'storage' },
    { id: 'importar', label: 'Importar Preguntas', icon: 'upload_file' },
    { id: 'generar', label: 'Generar Exámenes', icon: 'note_add' },
    { id: 'historial', label: 'Historial de Exámenes', icon: 'history' },
    { id: 'configuracion', label: 'Configuración', icon: 'settings' },
  ];

  return (
    <aside className="sidebar">
      {/* Cabecera del Sistema */}
      <div className="logo-container">
        <span className="material-icons-outlined logo-icon">receipt_long</span>
        <h1 className="logo-text">
          Sistema de Gestión<br />de Exámenes
        </h1>
      </div>

      {/* Menú de Navegación Dinámico */}
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="material-icons-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}