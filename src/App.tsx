import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './assets/components/Sidebar/Sidebar';
import Dashboard from './assets/components/pages/Dashboard';
import Areas from './assets/components/pages/Areas';
import BancoPreguntas from './assets/components/pages/BancoPreguntas';
import GenerarExamen from './assets/components/pages/GenerarExamen';
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
            <Route path="/areas" element={<Areas />} />
            <Route path="/banco" element={<BancoPreguntas />} />
            <Route path="/generar" element={<GenerarExamen />} />
            <Route path="/importar" element={<DemoPlaceholder icon="upload_file" title="Importación de Preguntas" description="Módulo previsto para incorporar preguntas desde archivos o fuentes externas y reducir el registro manual." items={['Carga desde archivos', 'Validación previa', 'Previsualización de contenido', 'Confirmación antes de guardar']} />} />
            <Route path="/historial" element={<DemoPlaceholder icon="history" title="Historial de Exámenes" description="Módulo previsto para consultar exámenes generados, versiones creadas y trazabilidad de cada proceso." items={['Búsqueda por fecha', 'Detalle por examen', 'Control de versiones', 'Consulta de configuración usada']} />} />
            <Route path="/configuracion" element={<DemoPlaceholder icon="settings" title="Configuración Institucional" description="Espacio previsto para parametrizar opciones propias de la institución antes de una implementación productiva." items={['Datos institucionales', 'Parámetros de examen', 'Roles y permisos', 'Preferencias de generación']} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
