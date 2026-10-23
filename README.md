# ⏳ Contador de Días (Day Counter)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25-success)](https://github.com/WilfryDev/Day-Counter)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/WilfryDev/Day-Counter/pulls)

**Calculadora de tiempo, intervalos y cuentas regresivas moderna, modular y de alta precisión.**  
Diseñada con arquitectura modular limpia, Web Audio API, soporte multilingüe, selector circular de colores universales y API cliente REST interactiva.

[🌐 Probar en Vivo](https://wilfrydev.github.io/Day-Counter/) • [⚡ Documentación API](api/index.html) • [📄 Términos y Privacidad](tos.html)

</div>

---

## 🌟 Características Principales

- ⏱️ **Cálculo Cronológico Preciso**: Días exactos transcurridos o faltantes (cuenta regresiva), contemplando años bisiestos y husos horarios.
- 🎨 **Paleta Circular Universal**: Rueda cromática circular interactiva (`conic-gradient`) que permite elegir cualquier color del espectro RGB sin manchar ni desfigurar el texto de las fechas.
- 🎯 **Presets Inteligentes**: Accesos rápidos a Año Nuevo, Navidad, San Valentín, Halloween, 30 días atrás, 100 días al futuro, más la capacidad de crear y guardar **Presets Personalizados** en tu navegador.
- 💼 **Modo Días Hábiles**: Opción para excluir sábados y domingos y computar solo días laborables.
- 📊 **Progreso del Año en Tiempo Real**: Barra visual con porcentaje exacto de avance del año en curso y conteo de días restantes.
- ➕➖ **Calculadora Inversa**: Averigua qué fecha exacta será sumando o restando cualquier número de días a una fecha base.
- 🔊 **Efectos de Sonido Web Audio API**: Sonidos sintéticos agradables y 100% offline (sin archivos de audio pesados), con volumen regulable y opción de mute.
- 🌐 **Soporte Multilingüe (6 Idiomas)**: Selector instantáneo para Español (🇪🇸), English (🇺🇸), Français (🇫🇷), Deutsch (🇩🇪), Português (🇧🇷) e Italiano (🇮🇹).
- 🌓 **Temas Dinámicos**: Modo Claro, Modo Oscuro y Modo Automático que se adapta a las preferencias de tu sistema.
- ⚡ **API Integrada y Sandbox**: Documentación en `api/index.html`, soporte de Query Params (`?start=YYYY-MM-DD&format=json`) y sandbox interactivo para desarrolladores.
- 🔒 **Local-First & Privacidad Total**: Sin seguimiento, sin cookies invasivas. Todos tus datos y presets se quedan en tu navegador.

---

## 📁 Estructura del Proyecto

```text
Day-Counter/
├── index.html              # Punto de entrada principal
├── contador.html           # Réplica directa optimizada
├── 404.html                # Página de error 404 temática con redirección
├── tos.html                # Términos de Servicio y Privacidad
├── README.md               # Documentación general del repositorio
├── tools/
│   └── index.html          # Suite de herramientas (Sumar/restar días, días hábiles)
├── api/
│   └── index.html          # Documentación técnica, sandbox interactivo y API
├── css/
│   └── styles.css          # Hoja de estilos modular y responsive
├── js/
│   ├── i18n.js             # Diccionario y motor multilingüe (ES, EN, FR, DE, PT, IT)
│   ├── audio.js            # Motor de sonido Web Audio API (offline)
│   ├── calculator.js       # Motor matemático de cálculo cronológico y días hábiles
│   ├── theme.js            # Gestor de temas y paleta de color circular
│   ├── presets.js          # Presets estándar y almacenamiento local
│   └── app.js              # Controlador central de eventos de la aplicación
└── assets/
    └── icons/              # Iconografía vectorial SVG estilo iOS
        ├── hourglass.svg
        ├── calendar.svg
        ├── gear.svg
        ├── sparkles.svg
        ├── target.svg
        ├── sound.svg
        └── palette.svg
```

---

## 🚀 Inicio Rápido

No necesitas Node.js, compiladores ni dependencias externas. Es código nativo puro (Vanilla Web).

### 1. Clonar el repositorio
```bash
git clone https://github.com/WilfryDev/Day-Counter.git
cd Day-Counter
```

### 2. Ejecutar localmente
Puedes abrir directamente el archivo `index.html` o `contador.html` con cualquier navegador:

```bash
# En Windows:
start contador.html

# O utilizando un servidor web ligero:
npx serve .
# o con Python:
python -m http.server 8000
```

---

## ⚡ Uso de la API y Parámetros URL

Puedes incrustar o consultar cálculos directamente a través de parámetros en la URL:

```http
GET /contador.html?start=2026-01-01&end=2026-10-23&include=true&format=json
```

### Respuesta JSON:
```json
{
  "valid": true,
  "startDate": "2026-01-01",
  "endDate": "2026-10-23",
  "includeStart": true,
  "onlyBusinessDays": false,
  "isSameDay": false,
  "isFuture": false,
  "days": 296,
  "absDays": 296,
  "breakdown": {
    "weeks": "42.3",
    "fullWeeks": 42,
    "remainingDays": 2,
    "approxMonths": "9.7",
    "hours": 7104,
    "minutes": 426240
  }
}
```

### Uso mediante JavaScript en el Navegador:
```javascript
// Disponible globalmente en window.ContadorAPI
const resultado = window.ContadorAPI.calculate("2026-01-01", "2026-12-31", true);
console.log(`Días: ${resultado.days}`);
console.log(`Semanas: ${resultado.breakdown.weeks}`);
```

---

## 🛠️ Tecnologías Empleadas

- **HTML5 Semántico**: Estructura limpia y accesible.
- **CSS3 Moderno**: Variables CSS nativas, Grid, Flexbox, backdrop-filter y animaciones fluidas.
- **JavaScript ES6+**: Arquitectura basada en clases, modularizada y desacoplada en `js/`.
- **Web Audio API**: Generación de audio algorítmico sin descargas de ficheros multimedia.
- **LocalStorage API**: Persistencia segura en el cliente.

---

## 🤝 Contribuciones

¡Las contribuciones, sugerencias y reportes de fallos son bienvenidos!
1. Haz un Fork del proyecto.
2. Crea una rama para tu función (`git checkout -b feature/NuevaFuncion`).
3. Realiza un commit con tus cambios (`git commit -m 'Añade nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/NuevaFuncion`).
5. Abre un Pull Request.

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` o [tos.html](tos.html) para más detalles.

Creado con precisión y pasión por **[WilfryDev](https://github.com/WilfryDev)**.
