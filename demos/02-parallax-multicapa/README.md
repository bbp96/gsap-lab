# 02 — Parallax Multicapa con Scrub Linear

Arquitectura de desplazamiento diferencial multi-plano sincronizada mediante una única Timeline central de GSAP y enlace continuo al scroll (*scrubbing*).

---

## 1. El Problema que Resuelve

El parallax convencional sufre de dos errores habituales en producción:

1. **Anti-patrón de Múltiples ScrollTriggers:** Crear una instancia de `ScrollTrigger` por cada elemento flotante genera decenas de listeners de scroll compitiendo en el *Main Thread*.
2. **Uso de Curvas de Easing en Scroll Scrubbing:** Aplicar `ease: 'power2.out'` o `ease: 'bounce'` a un movimiento atado a la rueda del ratón distorsiona la física natural del usuario, creando una sensación de desfasaje gomoso e incontrolable.

---

## 2. La Solución Arquitectónica

Se construye una **única Timeline maestra** atada a la sección contenedora, donde cada capa es añadida en el tiempo cero (`0`) con su delta de desplazamiento vertical específico (`y`):

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: arena,
    start: 'top bottom', // Inicia al cruzar el límite inferior
    end: 'bottom top',   // Concluye al salir por el límite superior
    scrub: 1.5           // Inercia de seguimiento cinematográfico (damping)
  }
});

layers.forEach((layer) => {
  tl.to(layer, {
    y: parseFloat(layer.dataset.speed),
    ease: 'none' // ← OBLIGATORIO: El control cinético lo ejerce la velocidad de scroll del usuario
  }, 0);
});
```

---

## 3. Matriz de Velocidades Ópticas

| Capa | Profundidad Visual | Delta ($Y$) | Comportamiento Físico |
|---|---|---|---|
| **Layer 01 (Fondo / Nebulosa)** | Plano Infinito | `-140px` | Movimiento lento; simula horizonte distante |
| **Layer 02 (Medio / Tarjeta Wireframe)** | Plano Intermedio | `-320px` | Velocidad moderada; referencia espacial |
| **Layer 03 (Core)** | Plano Neutro (Anchor) | `0px` | Punto focal legible de contenido |
| **Layer 04 (Frente / Micro-Chips)** | Primer Plano | `-540px` | Movimiento rápido; enfatiza la tridimensionalidad |

---

## 4. Costo de Rendimiento & WPO

1. **Zero Layout Reflows:** Todo el movimiento se ejecuta exclusivamente mediante la propiedad `transform: translate3d(0, y, 0)`, delegando la rasterización al *Compositor Thread* de la GPU sin recalcular geometrías de layout.
2. **Throttling Automático:** El motor de GSAP optimiza internamente las llamadas a `requestAnimationFrame`, asegurando que no se ejecuten cálculos redundantes si la posición de scroll no ha variado.

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
