import './DemoPlaceholder.css';

type Props = {
  icon: string;
  title: string;
  description: string;
  items: string[];
};

export default function DemoPlaceholder({ icon, title, description, items }: Props) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">
          <span className="material-icons-outlined">{icon}</span>
        </div>
        <span className="placeholder-label">MÓDULO CONSIDERADO EN LA PROPUESTA</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="placeholder-list">
          {items.map((item) => (
            <div key={item}>
              <span className="material-icons-outlined">check</span>
              {item}
            </div>
          ))}
        </div>
        <div className="placeholder-footnote">
          En esta demo se prioriza el flujo principal: áreas, banco de preguntas y generación de exámenes.
        </div>
      </div>
    </div>
  );
}
