import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './assets/components/Sidebar/Sidebar';
import Dashboard from './assets/components/pages/Dashboard';
import Procesos from './assets/components/pages/Procesos';
import Areas from './assets/components/pages/Areas';
import BancoPreguntas from './assets/components/pages/BancoPreguntas';
import GenerarExamen from './assets/components/pages/GenerarExamen';
import Historial from './assets/components/pages/Historial';
import DemoPlaceholder from './assets/components/pages/DemoPlaceholder';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '260px', padding: '32px', width: '100%', minHeight: '100vh', background: '#f8f9fb' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/procesos" element={<Procesos />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/banco" element={<BancoPreguntas />} />
            <Route path="/generar" element={<GenerarExamen />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/importar" element={<DemoPlaceholder icon="upload_file" title="Importación de Preguntas" description="Módulo previsto para incorporar preguntas desde archivos o fuentes externas y reducir el registro manual." items={['Carga desde archivos', 'Validación previa', 'Previsualización de contenido', 'Confirmación antes de guardar']} />} />
            <Route path="/configuracion" element={<DemoPlaceholder icon="settings" title="Configuración Institucional" description="Espacio previsto para parametrizar opciones propias de la institución antes de una implementación productiva." items={['Datos institucionales', 'Parámetros de examen', 'Roles y permisos', 'Preferencias de generación']} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
