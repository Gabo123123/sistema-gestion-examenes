import { demoStore } from '../../../demoStore';
import './Areas.css';

export default function Historial() {
  const items = demoStore.getHistory();
  return (
    <div className="areas-container">
      <div className="page-header"><div><h2 className="page-title">Historial de Exámenes</h2><p style={{margin:'6px 0 0',color:'#5f6368',fontSize:13}}>Registro local de las generaciones realizadas durante la demo.</p></div></div>
      <div className="table-card"><table><thead><tr><th>Proceso</th><th>Fecha</th><th>Preguntas</th><th>Versiones</th></tr></thead><tbody>
        {items.map((i)=><tr key={i.id}><td><strong>{i.processName}</strong></td><td>{new Date(i.createdAt).toLocaleString()}</td><td>{i.questionCount}</td><td>{i.versions}</td></tr>)}
        {items.length===0 && <tr><td colSpan={4} style={{textAlign:'center',padding:30,color:'#777'}}>Aún no se ha generado ningún examen.</td></tr>}
      </tbody></table></div>
    </div>
  );
}
