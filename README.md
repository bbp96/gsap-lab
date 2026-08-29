# GSAP Performance Lab

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Sitio Web:** [brante.dev](https://brante.dev) · **LinkedIn:** [benjaminbrante](https://linkedin.com/in/benjaminbrante)  
> **Stack:** GSAP 3.12.5 · ScrollTrigger · CustomEase · JavaScript ES6 Vanilla · CSS3 Grid/Flexbox

---

## 🎯 Por qué existe este repositorio

En muchos proyectos web donde se usan animaciones (especialmente en sitios corporativos con WordPress o Astro), el problema suele ser el mismo: las animaciones se ven bonitas en una MacBook de desarrollo, pero en un teléfono móvil de gama media la página da tirones, el scroll se pega o la batería se drena rápido.

Este repositorio no es un muestrario de efectos visuales sin sentido: es una **colección de soluciones técnicas y patrones de arquitectura** que he aplicado en proyectos de producción para garantizar que las animaciones corran a **60 FPS estables**, sin recalcular el DOM innecesariamente y respetando el consumo de recursos del usuario.

---

## 📂 Directorio de Demos y Variantes Técnicas

Cada carpeta contiene un archivo `index.html` autónomo (sin dependencias de build ni bundlers) y su respectivo `README.md` técnico con el desglose del código.

### [01. Entradas 3D con ScrollTrigger y CustomEase](demos/01-entrada-3d/)
- **El problema:** Los fade-in clásicos se sienten planos. La rotación 3D aporta peso, pero si no declaras perspectiva se ve deforme, y si dejas `will-change` pegado en CSS saturas la memoria VRAM del teléfono.
- **Variantes incluidas:**
  1. *Flip Lateral Asimétrico* (pivote en el borde con rotación en Y y rebote elástico).
  2. *Proyección de Profundidad en Eje Z* (escala + perspectiva frontal).
  3. *Desdoble Origami Diagonal* (combinación de Skew y rotación).
- **Criterio WPO:** Activación dinámica de `will-change` por JavaScript y liberación inmediata a `auto` en el callback `onComplete`.

---

### [02. Parallax Multicapa con Scrub](demos/02-parallax-multicapa/)
- **El problema:** Poner un listener de `window.addEventListener('scroll')` por cada capa flotante satura el hilo principal del navegador.
- **Modos incluidos:**
  1. *Profundidad Clásica Multi-Plano* (deltas de velocidad escalonados: -160px, -340px, -580px).
  2. *Movimiento Opuesto (Split)* (capas laterales en contracorriente respecto al centro).
  3. *Parallax con Rotación y Escala Sincronizada al Scroll*.
- **Criterio WPO:** Una sola Timeline maestra sincronizada con `scrub: 1.5` y `ease: 'none'`, ejecutando un único cálculo compuesto por frame.

---

### [03. Bucles Armónicos Desfasados](demos/03-loops-desfasados/)
- **El problema:** Cuando varios elementos flotan con la misma duración exacta (`2.0s`), el ojo humano detecta el patrón en 2 segundos y la animación se siente rígida y mecánica.
- **Patrones incluidos:**
  1. *Flotación Orgánica Multi-Eje* (Y + Rotación + Escala desfasados con números primos).
  2. *Efecto Onda en Cascada* (desfase progresivo por índice).
  3. *Pulso y Respiración Alternada* (giros y escala con polaridad opuesta).
- **Criterio WPO:** Solo se animan propiedades de composición (`transform`).

---

### [04. Suspensión de Animaciones Fuera del Viewport](demos/04-suspension-viewport/)
- **El problema:** Una animación en bucle infinito que sigue corriendo cuando el usuario ya scrolleó hacia otra sección es un desperdicio de batería y ciclos de GPU.
- **Características:**
  - Control de pausa y reanudación automática en 0 ms con `IntersectionObserver`.
  - Margen preventivo `rootMargin: '10% 0px'` para que la animación despierte una fracción de segundo antes de cruzar la pantalla.
  - Telemetría en tiempo real a 60 FPS con contador de frames ahorrados y tasa de eficiencia de CPU.

---

### [05. Carga Condicional y Guard con rAF](demos/05-carga-condicional/)
- **El problema:** El uso de `setTimeout(fn, 500)` para esperar a que cargue una librería externa en WordPress es un antipatrón. Si el usuario tiene conexión lenta falla (`TypeError: gsap is not defined`), y si tiene conexión rápida pierde medio segundo de experiencia.
- **Sandbox con 4 escenarios simulados:**
  1. *Fast 3G (300 ms)* — Sondeo frame a frame hasta resolución rápida.
  2. *Slow 3G (1200 ms)* — Manejo de latencia real sin bloquear la interfaz.
  3. *Caché Local (0 ms)* — Ejecución inmediata en Frame #1.
  4. *Fallo 404 / Timeout Defensivo* — Límite seguro de 3 segundos y activación de degradación elegante (Fallback CSS).

---

### [06. Recálculo tras Imágenes Diferidas y Zero CLS](demos/06-refresh-lazy-images/)
- **El problema:** Al combinar `loading="lazy"` o acordeones con `ScrollTrigger`, cuando las imágenes descargan empujan el contenido y descalibran los puntos de activación (`start`/`end`).
- **Solución en 2 capas:**
  1. *Capa Preventiva (CSS):* Reserva dimensional con `aspect-ratio: 16/9` para lograr un Cumulative Layout Shift (CLS) exacto de 0.000.
  2. *Capa Reactiva (JS):* Suscripción al evento `load` con `{ once: true }` y sincronización en mutaciones del DOM mediante `ScrollTrigger.refresh()`.

---

## 🛠️ Cómo ejecutar este repositorio localmente

No necesitas Node.js, Webpack ni dependencias externas:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/bbp96/gsap-lab.git
   ```
2. Abre `index.html` directamente en tu navegador o usa cualquier servidor local estático (como Live Server en VS Code o `npx serve .`).

---

## 📋 Principios de Calidad Frontend Aplicados

- **GPU First:** Solo se animan `transform` y `opacity`. Cero cambios a propiedades que provoquen *layout thrashing* (`top`, `left`, `margin`, `width`, `height`).
- **Gestión de Memoria:** Limpieza activa de `will-change` en `onComplete` para no saturar la memoria gráfica en móviles.
- **Accesibilidad (a11y):** Verificación estricta de `prefers-reduced-motion` en cada módulo para desactivar animaciones si el usuario lo solicita en su sistema operativo.
- **Zero CLS:** Cumplimiento de métricas Core Web Vitals reservando espacios antes de la carga de assets.

---

## 📄 Licencia

Código bajo licencia MIT. Desarrollado por **Benjamín Brante**.  
Puedes usar libremente estos patrones en tus propios proyectos web.
