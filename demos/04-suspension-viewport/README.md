# 04 — Suspensión de Animaciones Fuera del Viewport

Arquitectura de conservación de energía y ciclo de GPU mediante `IntersectionObserver`, pausando bucles infinitos cuando salen del campo visual y reanudándolos sin saltos visuales.

---

## 1. El Problema Oculto del Rendimiento Web

Una animación en bucle infinito (`repeat: -1`, carrusel en autoplay, player Lottie o Canvas) continúa consumiendo ciclos de cómputo y energía de la batería **aunque el usuario se encuentre scrolleando cinco secciones más abajo**.

- En equipos de escritorio con GPU dedicada, el impacto puede pasar desapercibido.
- En dispositivos móviles de gama media y baja, esto genera **estrés térmico (*thermal throttling*)**, consumo acelerado de batería y micro-tirones (*jank*) al interactuar con otras partes del sitio.

---

## 2. La Solución Arquitectónica

```javascript
// 1. Instanciación en reposo (paused: true)
const tw = gsap.to(element, {
  y: -28,
  repeat: -1,
  yoyo: true,
  paused: true // ← No consume CPU hasta ser observado
});

// 2. Observer no-bloqueante
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tw.play();
    } else {
      tw.pause();
    }
  });
}, {
  rootMargin: '10% 0px' // Margen de anticipación del 10%
});

observer.observe(contenedor);
```

### Principios Clave:
1. **`paused: true` en la inicialización:** Si el usuario abandona la página antes de hacer scroll hasta la sección, no se habrá ejecutado ni un solo cálculo de frame.
2. **`rootMargin: '10% 0px'`:** El observador activa el tween un 10% antes de que el borde superior del contenedor cruce el viewport. Esto asegura que la animación ya esté en movimiento en el instante exacto en que entra en la vista del usuario.

---

## 3. Comparativa: `IntersectionObserver` vs Eventos `scroll`

| Métrica | `window.addEventListener('scroll')` | `IntersectionObserver` |
|---|---|---|
| **Frecuencia de Disparo** | En cada frame de scroll (requiere throttling) | Únicamente al cruzar el umbral definido |
| **Costo en Reposo** | Activo constantemente evaluando coordenadas | **0% CPU** (delegado a los hilos internos del navegador) |
| **Forzado de Reflow** | Sí (`getBoundingClientRect()`) | **No** (sin reflows del DOM) |
| **Impacto en Main Thread** | Alto riesgo de bloquear interacciones | Completamente desacoplado |

---

## 4. Telemetría de la Demo

La demo integra un monitor de telemetría a 60 FPS que mide:
- **Frames Renderizados:** Ciclos GPU/CPU ejecutados mientras el contenedor está visible.
- **Frames Ahorrados:** Ciclos que fueron omitidos de cómputo mientras el contenedor estuvo suspendido fuera de pantalla.
- **Tasa de Ahorro:** Porcentaje acumulado de energía preservada en tiempo real.

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
