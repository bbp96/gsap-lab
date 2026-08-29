# GSAP Performance Lab

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Sitio Web:** [brante.dev](https://brante.dev) · **LinkedIn:** [benjaminbrante](https://linkedin.com/in/benjaminbrante)  
> **Stack:** GSAP 3.12.5 · ScrollTrigger · CustomEase · JavaScript ES6 Vanilla · CSS3 Grid/Flexbox

---

## 🎯 Por qué existe este repositorio

En muchos proyectos web donde se usan animaciones (especialmente en sitios corporativos con WordPress o Astro), el problema suele ser el mismo: las animaciones se ven bonitas en una computadora de desarrollo potente, pero en un teléfono móvil de gama media la página da tirones, el scroll se pega o la batería se consume rápido.

Este repositorio no es un muestrario de efectos visuales sin sentido: es una **colección de 11 soluciones técnicas y patrones de arquitectura** que he aplicado en proyectos de producción para garantizar que las animaciones corran a **60 FPS estables**, sin recalcular el DOM innecesariamente, sin fugas de memoria en navegaciones tipo SPA y respetando el consumo de recursos del usuario.

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

### [07. Timelines Responsivas con `gsap.matchMedia()`](demos/07-matchmedia-responsive/)
- **El problema:** Una animación diseñada para escritorio (carrusel horizontal o pinning) rompe el layout en móvil si se maneja con listeners de `resize` manuales, dejando estilos inline pegados en el DOM.
- **Solución:** `gsap.matchMedia()` encapsula los tweens y **revierte automáticamente todas las transformaciones CSS** al cruzar breakpoints (escritorio vs. móvil vs. `prefers-reduced-motion`).

---

### [08. Aislamiento y Limpieza con `gsap.context()`](demos/08-context-cleanup/)
- **El problema:** En SPAs, Astro con View Transitions, Swup o islas reactivas, navegar entre páginas sin limpiar los tweens deja procesos huérfanos consumiendo memoria y provocando fugas de memoria (memory leaks).
- **Solución:** `gsap.context()` acota los selectores al componente y permite llamar a `ctx.revert()` en una sola línea al desmontar la vista, matando todos los tweens y ScrollTriggers al 100%.

---

### [09. Texto Revelado por Líneas sin Plugins de Pago](demos/09-texto-revelado-lineas/)
- **El problema:** El efecto de texto revelado línea por línea es codiciado en landing pages tipo Apple o Stripe, pero el plugin oficial `SplitText` es de pago (Club GreenSock) y otras librerías de terceros inflan el bundle.
- **Solución:** Algoritmo nativo en JavaScript Vanilla que divide el contenido en máscaras con `overflow: hidden` y anima las líneas interiores con `yPercent: 115` a `0` a 60 FPS con cero dependencias de pago.

---

### [10. Canvas con Secuencia de Frames Controlado por Scroll](demos/10-canvas-secuencia-scroll/)
- **El problema:** Cambiar etiquetas `<img src="...">` al hacer scroll para rotar un producto causa parpadeos blancos y satura el hilo principal del navegador.
- **Solución:** Renderizado sobre un único elemento `<canvas>` 2D sincronizado mediante `ScrollTrigger.scrub`, pintando los frames directamente en el búfer de la GPU en menos de 1 milisegundo por frame.

---

### [11. Benchmark en Vivo: `transform` vs. `top` / `left`](demos/11-benchmark-transform-vs-layout/)
- **El problema:** Mover elementos modificando propiedades de layout (`top`, `left`, `margin`) fuerza al navegador a ejecutar Layout + Paint 60 veces por segundo en el hilo principal de la CPU.
- **Demostración:** Comparativa interactiva con 80 partículas y telemetría de FPS en vivo: el modo `top/left` provoca caídas a 20 FPS y 80 Reflows/frame, mientras que el modo `transform` corre a 60 FPS fijos con 0 ms de bloqueo.

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
- **Gestión de Memoria:** Limpieza activa de `will-change` en `onComplete` y uso estricto de `gsap.context()` con `ctx.revert()` en ciclos de vida dinámicos.
- **Accesibilidad (a11y):** Verificación estricta de `prefers-reduced-motion` en cada módulo para desactivar animaciones si el usuario lo solicita en su sistema operativo.
- **Zero CLS:** Cumplimiento de métricas Core Web Vitals reservando espacios antes de la carga de assets.

---

## 📄 Licencia

Código bajo licencia MIT. Desarrollado por **Benjamín Brante**.  
Puedes usar libremente estos patrones en tus propios proyectos web.
