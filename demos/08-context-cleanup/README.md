# 08 — Aislamiento y Limpieza con `gsap.context()`

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Técnica:** `gsap.context()` · Scope Local de Selectores · Reversión Total de Ciclo de Vida

---

## 🎯 El Problema en Producción

En arquitecturas frontend modernas (Astro con View Transitions, Barba.js, Swup, o componentes de React/Vue), el contenido del DOM cambia sin que la página se recargue por completo.

Si creas animaciones de GSAP de forma tradicional:
1. **Fugas de Memoria (Memory Leaks):** Los bucles (`repeat: -1`) y listeners de scroll siguen ejecutándose sobre nodos desconectados del DOM.
2. **Colisiones de Selectores:** Un selector como `gsap.to('.card', ...)` animará elementos de otras páginas o componentes repetidos si no está acotado.
3. **Estilos en línea persistentes:** Al salir de la vista, los elementos pueden quedar con opacidades o desplazamientos que rompen la siguiente navegación.

---

## 💡 La Solución con `gsap.context()`

`gsap.context()` resuelve estos tres problemas simultáneamente:
- **Scoping Automático:** Todos los selectores dentro del callback buscan exclusivamente dentro del elemento pasado como segundo argumento (`scopeRef`).
- **Limpieza en una sola línea:** `ctx.revert()` detiene todas las animaciones, mata los ScrollTriggers asociados y restaura las propiedades CSS originales en el DOM.

```javascript
let ctx;

// Al montar el componente
function onMount(containerElement) {
  ctx = gsap.context(() => {
    // Todos los selectores quedan aislados a 'containerElement'
    gsap.to('.box', { rotation: 360, repeat: -1 });
    gsap.from('.title', { y: 20, opacity: 0 });
  }, containerElement);
}

// Al desmontar o cambiar de ruta
function onDestroy() {
  ctx.revert(); // Mata todos los tweens y limpia el DOM al 100%
}
```

---

## 🛡️ Criterio WPO y Buenas Prácticas

- **Uso en Astro View Transitions:** Ideal para conectarse al hook `document.addEventListener('astro:before-swap', () => ctx.revert())`.
- **Recolector de Basura Seguro:** Permite al motor V8 de Chromium liberar la memoria de los nodos HTML inmediatamente.
- **Sin Efectos Secundarios:** Los estilos inline generados por GSAP desaparecen al revertir.
