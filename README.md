# GSAP Performance Lab — Técnicas de Animación Web con Foco en Rendimiento

Colección de módulos de ingeniería frontend autocontenidos que documentan patrones avanzados de animación con **GSAP 3.12.5** y **ScrollTrigger**, con especial énfasis en **Web Performance Optimization (WPO)**, eliminación de *Layout Shifts* (CLS = 0.000) y conservación de batería en dispositivos móviles.

Cada demo es un archivo HTML independiente: se abre directamente en el navegador sin herramientas de *build* ni dependencias locales.

---

## 🎯 Por Qué Existe Este Repositorio

La mayoría de los tutoriales de animación web se limitan a mostrar cómo lograr un efecto visual sin considerar su impacto colateral:
- Animaciones en bucle que continúan consumiendo ciclos de GPU y batería cuando la sección ya no está visible.
- Triggers de `ScrollTrigger` que se descalibran cientos de píxeles al cargar imágenes con `loading="lazy"`.
- Caídas de frames (*jank*) en dispositivos móviles por animar propiedades que disparan reflows del DOM (`top`, `left`, `margin`).

Este laboratorio documenta la solución arquitectónica para cada uno de estos escenarios: **la técnica y su costo de rendimiento.**

---

## 📦 Catálogo de Demos

| # | Módulo | Técnica Arquitectónica | Foco de Rendimiento (WPO) |
|---|---|---|---|
| **01** | [Entrada 3D con ScrollTrigger](demos/01-entrada-3d/) | `rotationY` con perspectiva, `transformOrigin` lateral y curvas Bézier con *overshoot* en `CustomEase`. | Liberación de VRAM (`will-change: auto` en `onComplete`). |
| **02** | [Parallax Multicapa](demos/02-parallax-multicapa/) | Timeline única centralizada, desplazamiento diferencial multi-plano y `scrub: 1.5` lineal (`ease: 'none'`). | Eliminación de listeners redundantes en el *Main Thread*. |
| **03** | [Bucles Desfasados](demos/03-loops-desfasados/) | Tres oscilaciones simultáneas por nodo ($Y$, rotación, escala) con offsets matemáticos no coincidentes. | Movimiento orgánico sin fatiga visual ni recálculo de layout. |
| **04** | [Suspensión Fuera del Viewport](demos/04-suspension-viewport/) | `IntersectionObserver` con margen preventivo (`rootMargin: 10% 0px`) y control de estado `play()` / `pause()`. | **0% CPU** y ahorro de batería cuando la sección no es visible. |
| **05** | [Carga Condicional & Guard](demos/05-carga-condicional/) | Verificación de dependencias frame a frame mediante `requestAnimationFrame` sin `setTimeout` arbitrario. | Resolución en el frame exacto (0 ms latencia residual). |
| **06** | [Recálculo con Imágenes Diferidas](demos/06-refresh-lazy-images/) | Reserva dimensional en CSS (`aspect-ratio: 16/9`) + red de seguridad con `ScrollTrigger.refresh()`. | **Zero Cumulative Layout Shift (CLS = 0.000)** garantizado. |

---

## 🛠️ Estructura del Repositorio

```
gsap-lab/
├── .gitignore
├── LICENSE                  # Licencia MIT (Benjamín Brante)
├── README.md                # Documentación maestra
├── index.html               # Portal Showcase y catálogo interactivo
└── demos/
    ├── 01-entrada-3d/
    │   ├── index.html
    │   └── README.md        # Especificación técnica, curvas y WPO
    ├── 02-parallax-multicapa/
    │   ├── index.html
    │   └── README.md
    ├── 03-loops-desfasados/
    │   ├── index.html
    │   └── README.md
    ├── 04-suspension-viewport/
    │   ├── index.html
    │   └── README.md
    ├── 05-carga-condicional/
    │   ├── index.html
    │   └── README.md
    └── 06-refresh-lazy-images/
        ├── index.html
        └── README.md
```

---

## 🚀 Cómo Ejecutarlo

1. Clonar el repositorio:
```bash
git clone https://github.com/bbp96/gsap-lab.git
cd gsap-lab
```

2. Abrir `index.html` directamente con doble clic en tu navegador, o servirlo localmente:
```bash
# Con Python
python -m http.server 8000

# Con Node (npx)
npx serve .
```

---

## ⚡ Principios de Ingeniería Aplicados

1. **GPU Compositing Exclusivo:** Todo movimiento se delega a `transform: matrix3d(...)` y `opacity`. Cero mutaciones de propiedades geométricas de layout (`width`, `height`, `top`).
2. **Gestión Activa de VRAM:** Declaración transitoria de `will-change` durante el ciclo de animación y liberación inmediata al finalizar.
3. **Zero Idle Overhead:** Pausa automática de bucles infinitos fuera del viewport mediante `IntersectionObserver`.
4. **Accesibilidad Universal (WCAG 2.1 AA):** Verificación estricta de `prefers-reduced-motion` en todos los módulos para usuarios con sensibilidad vestibular.
5. **Alcance Aislado (Clean Scope):** Módulos encapsulados en IIFE estrictos sin contaminar el objeto global `window`.

---

## 👨‍💻 Autor

**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
- Sitio Web: [brante.dev](https://brante.dev)  
- LinkedIn: [linkedin.com/in/benjaminbrante](https://linkedin.com/in/benjaminbrante)  
- GitHub: [@bbp96](https://github.com/bbp96)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
