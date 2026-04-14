import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content animate-fade-in stagger-1">
        <div className="icon-wrapper">
          <ShieldAlert size={80} className="text-accent" />
          <div className="glow-effect"></div>
        </div>
        <h1 className="error-code">404</h1>
        <h2>Página no encontrada</h2>
        <p className="text-muted">
          El módulo o paciente que buscas parece no existir o fue movido de lugar. 
          Verifica la URL o regresa al panel principal.
        </p>
        <Link to="/" className="btn btn-primary back-home-btn">
          <ArrowLeft size={18} />
          Volver al Dashboard Central
        </Link>
      </div>
    </div>
  );
}
