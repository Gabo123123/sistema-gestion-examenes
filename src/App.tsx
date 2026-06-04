import Sidebar from './assets/components/Sidebar/Sidebar'; // Asegúrate de que la ruta coincida con tus carpetas
import './App.css'; 

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Barra lateral fija */}
      <Sidebar />
      
      {/* Contenedor del contenido principal */}
      <main style={{ marginLeft: '260px', padding: '32px', width: '100%' }}>
        <h2>Dashboard</h2>
        <p>Contenido principal aquí...</p>
      </main>
    </div>
  );
}