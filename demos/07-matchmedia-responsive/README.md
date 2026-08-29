# 07 — Timelines Responsivas con `gsap.matchMedia()`

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Técnica:** `gsap.matchMedia()` · Limpieza Automática de Tweens · Cero Colisiones al Redimensionar

---

## 🎯 El Problema en Producción

En diseño responsivo, una animación pensada para escritorio (por ejemplo, un carrusel horizontal con fijación o pinning) no funciona en una pantalla de teléfono.

El error común es usar `window.addEventListener('resize', debouncedFn)` para recrear los tweens. Esto tiene tres fallos graves:
1. **Estilos inline huérfanos:** Cuando la pantalla cambia de tamaño, las transformaciones previas (`transform: translate3d(...)`) quedan pegadas en el DOM y rompen el layout en móvil.
2. **Duplicación de ScrollTriggers:** Si no matas cada instancia a mano, se acumulan triggers invisibles en memoria.
3. **Consumo innecesario en el hilo principal:** Los listeners de resize manuales provocan recálculos de estilo forzados.

---

## 💡 La Solución con `gsap.matchMedia()`

`gsap.matchMedia()` encapsula las animaciones dentro de contextos condicionales. Cuando el navegador cruza el breakpoint (por ejemplo, al rotar una tablet o cambiar el tamaño de la ventana), GSAP **revierte automáticamente todas las propiedades CSS modificadas** a su estado original antes de ejecutar el bloque correspondiente al nuevo tamaño.

```javascript
const mm = gsap.matchMedia();

// 1. Regla para Desktop (> 800px)
mm.add("(min-width: 801px)", () => {
  gsap.from(".card", {
    x: 120,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: "power3.out"
  });
});

// 2. Regla para Móvil (<= 800px)
mm.add("(max-width: 800px)", () => {
  gsap.from(".card", {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: "power2.out"
  });
});

// 3. Regla para Accesibilidad (prefers-reduced-motion)
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(".card", { opacity: 1, x: 0, y: 0 });
});
```

---

## 🛡️ Criterio WPO y Buenas Prácticas

- **Cero Memory Leaks:** No necesitas limpiar listeners de redimensionado manualmente.
- **Soporte Nativo de a11y:** Integración directa con `prefers-reduced-motion` sin condicionales complicados.
- **Estilos CSS Limpios:** No requiere `!important` para sobrescribir transformaciones en hojas de estilo móviles.
