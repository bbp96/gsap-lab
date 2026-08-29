# Demo 12: Cursor Magnético & Físicas Inerciales con gsap.quickTo()

> **Técnica:** Tubería de animación directa de alto rendimiento sin asignación de memoria (*zero memory churn*) en eventos de alta frecuencia (`pointermove` / `mousemove`).

---

## 1. El Problema Real: Saturación del Garbage Collector

En interfaces interactivas modernas es común ver cursores personalizados o botones con atracción magnética. El patrón novato suele implementarse así:

```javascript
// ❌ MALA PRÁCTICA: Crea cientos de objetos Tween por segundo
window.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
    ease: 'power2.out'
  });
});
```

### ¿Por qué esto degrada el rendimiento?
1. Los ratones para gaming y trackpads modernos emiten eventos a frecuencias de entre **125 Hz y 1000 Hz**.
2. Cada llamada a `gsap.to()` dentro del listener instancia un nuevo objeto `Tween`, calcula propiedades, parsea selectores y sobreescribe la animación previa.
3. Esto genera miles de objetos efímeros en la memoria RAM, disparando pausas del **Garbage Collector (GC)** que provocan microtirones (*jank*) visibles en la pantalla.

---

## 2. La Solución Técnica: `gsap.quickTo()`

GSAP 3 introdujo `gsap.quickTo(target, property, vars)`, una función optimizada diseñada específicamente para valores que cambian continuamente:

```javascript
// ✓ SOLUCIÓN SENIOR: Reutiliza la misma instancia interna de animación
const setCursorX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
const setCursorY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

window.addEventListener('pointermove', (e) => {
  // Cero instanciación de objetos: solo actualiza el destino numérico
  setCursorX(e.clientX);
  setCursorY(e.clientY);
});
```

### Beneficios de Arquitectura:
- **Cero recolección de basura:** No se crean objetos nuevos en el heap de JavaScript por cada frame.
- **Sincronización suave:** Si el cursor se mueve antes de que termine el tween previo, `quickTo()` redirige la trayectoria de forma inercial sin saltos bruscos.
- **Atracción magnética elástica:** Permite desacoplar el movimiento del botón y su contenido con diferente factor de masa y amortiguación.

---

## 3. Criterios de Accesibilidad & WPO

1. **Detección de Dispositivos Táctiles (`hover: none`):**
   - En pantallas táctiles no existe cursor físico. El código detecta `@media (hover: none) and (pointer: coarse)` y evita inicializar listeners o renderizar nodos innecesarios.
2. **Gestión de Visibilidad Viewport:**
   - Si el puntero abandona la ventana del navegador (`mouseleave`), el cursor se oculta con una transición de opacidad y suspende actualizaciones.
3. **Respeto a `prefers-reduced-motion`:**
   - Si el usuario prefiere movimiento reducido, los efectos magnéticos se desactivan y el cursor vuelve al comportamiento nativo del sistema operativo.

---

## 4. Estructura de la Demo

- **Modo 1: Seguidor Inercial (Dual Ring):** Núcleo ágil (`0.1s`) + halo exterior elástico (`0.45s`).
- **Modo 2: Botón con Atracción Magnética:** Fuerza de gravedad que atrae el botón hacia el cursor al entrar en su radio de acción.
- **Modo 3: Fusión y Expansión (Spotlight):** Escala ampliada con `mix-blend-mode: difference` para revelar contenido en capas oscuras.
