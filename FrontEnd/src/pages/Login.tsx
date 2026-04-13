import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', clinicName: '', chairs: 3
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      login(data.data.user, data.data.token);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Error de conexión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      <div className="login-container animate-fade-in">
        <div className="login-brand">
          <div className="login-logo">
            <BrainCircuit size={32} />
          </div>
          <h1>DentalFlow <span>AI</span></h1>
          <p>Tu CFO Digital para la clínica</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="label">Tu nombre</label>
                <input className="input" type="text" name="name" placeholder="Dr. Juan Pérez"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Nombre de tu clínica</label>
                <input className="input" type="text" name="clinicName" placeholder="Clínica Dental Sonrisa"
                  value={form.clinicName} onChange={handleChange} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" name="email" placeholder="carlos@clinica.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="label">Contraseña</label>
            <div className="input-password-wrap">
              <input className="input" type={showPassword ? 'text' : 'password'}
                name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required minLength={6} />
              <button type="button" className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : null}
            {isRegister ? 'Crear cuenta' : 'Entrar'}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="login-toggle">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </form>

        <p className="login-demo-hint">
          Demo: carlos@sonrisa.com / demo1234
        </p>
      </div>
    </div>
  );
}
