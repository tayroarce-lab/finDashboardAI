# 🦷 DentalFlow AI — MVP CFO Digital

DentalFlow AI es un panel de control financiero y operativo de última generación diseñado específicamente para clínicas dentales. Combina analítica avanzada en tiempo real con Inteligencia Artificial para transformar datos crudos de facturación y gastos en decisiones estratégicas de alta rentabilidad.

![Status](https://img.shields.io/badge/Status-MVP-blueviolet)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20MySQL%20%7C%20n8n-blue)

---

## 🚀 Características Principales

### 📊 Dashboard Ejecutivo
Visualización inmediata de KPIs críticos (Ingresos, Gastos, EBITDA, Ocupación). Gráficos dinámicos comparativos para detectar tendencias antes de que afecten el flujo de caja.

### 💎 Análisis de Rentabilidad (Matriz de Cuadrantes)
Clasificación automática de tratamientos en 4 categorías estratégicas:
- **Estrellas:** Alto margen y alto volumen.
- **Joyas:** Alto margen, bajo volumen (¡Aumentar ventas!).
- **Vacas:** Bajo margen, alto volumen (Optimizar costos).
- **Trampas:** Bajo margen y bajo volumen (Eliminar o reestructurar).

### ⏱️ Módulo "Chair-Time"
Análisis de eficiencia por profesional. Mide cuánto dinero genera cada doctor por hora ocupada en el sillón dental ($/H), permitiendo optimizar agendas y comisiones.

### 🤖 CFO Digital (Analítica con IA)
Integración con **n8n y OpenAI**. El sistema analiza los patrones de gasto y rentabilidad de la última semana para generar "Insights del Día" y recomendaciones accionables para la dueña de la clínica.

---

## 🛠️ Stack Tecnológico

**Frontend:**
- **React 18** + TypeScript + Vite.
- **Recharts** para visualización de datos premium.
- **Lucide React** para iconografía moderna.
- **CSS3 Vanilla** con diseño Glassmorphism y Dark Mode.

**Backend:**
- **Node.js** + Express.
- **MySQL** como motor de base de datos relacional.
- Arquitectura **MVC** (Models, Views, Controllers, Repositories).
- Seguridad vía **JWT** y BCrypt.

**Automatización & IA:**
- **n8n** (Workflow engine).
- **OpenAI API** (GPT-4) para el análisis predictivo.

---

## 📦 Instalación y Setup

### 1. Base de Datos
1. Asegúrate de tener MySQL corriendo.
2. Ejecuta el archivo de esquema `BackEnd/seed/schema.sql`.
3. (Opcional) Carga los datos demo: `BackEnd/seed/seed.sql`.

### 2. Backend
```bash
cd BackEnd
npm install
# Configura tu .env (DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET)
npm start
```

### 3. Frontend
```bash
cd FrontEnd
npm install
npm run dev
```

### 4. Automatización (n8n)
1. Importa el workflow `DentalFlow_CFO_Version_Definitiva`.
2. Configura tu `OPENAI_API_KEY` en el nodo de OpenAI.
3. El workflow se conecta al backend mediante HTTP Requests para leer datos y guardar insights.

---

## 📂 Estructura del Proyecto

```text
finDashboardAI/
├── BackEnd/                # Servidor Node.js
│   ├── controllers/        # Controladores (Lógica de ruteo)
│   ├── services/           # Lógica de Negocio
│   ├── repositories/       # Consultas SQL (Data layer)
│   └── seed/               # SQL Scripts & Seeder
├── FrontEnd/               # App React
│   ├── src/
│   │   ├── components/     # UI Reutilizable
│   │   ├── pages/          # Vistas (Dashboard, Doctors, etc.)
│   │   └── types/          # Definiciones TypeScript
└── n8n/                    # Workflows de IA
```

---

## 🎯 Próximos Pasos (Roadmap)
- [ ] Implementar gestión de inventario automatizada.
- [ ] Exportación de reportes PDF detallados.
- [ ] Integración con WhatsApp para recordatorios dinámicos.

---
Creado con ❤️ para la optimización odontológica.
