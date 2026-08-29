# 01 — Entrada 3D con ScrollTrigger & CustomEase

Módulo de animación espacial con transformaciones 3D en el eje Y, punto de pivote dinámico (`transformOrigin`), curva de aceleración personalizada con rebote físico elástico (*overshoot*) y desasignación de capas de composición en GPU.

---

## 1. El Problema Arquitectónico

Un efecto de `fade in` estándar bidimensional carece de tridimensionalidad y jerarquía visual. La integración de rotaciones en el eje Y resuelve esto, pero introduce dos desafíos técnicos críticos:

1. **Colapso de Proyección (Falta de Perspectiva):** Sin declarar una perspectiva tridimensional (`transformPerspective`), la rotación en el eje Y no genera profundidad visual: el elemento simplemente se encoge y aplasta sobre el plano 2D. Declarar `transformPerspective: 900` establece la distancia focal virtual entre el usuario y la pantalla.
2. **Kinética Desalineada:** El punto de pivote (`transformOrigin`) debe acompañar el vector de entrada:
   - Si la tarjeta entra desde la izquierda: `transformOrigin: 'left center'`.
   - Si entra desde la derecha: `transformOrigin: 'right center'`.

---

## 2. Curvas de Easing Propias (`CustomEase`)

Los presets estándar (`power2.out`, `ease-out`) son lineales o cuadráticos comunes. `CustomEase` nos permite modelar la física de un objeto con inercia mediante curvas Bézier cúbicas personalizadas:

```javascript
// 'asentado' produce un 18% de overshoot antes de estabilizarse
CustomEase.create('asentado', 'M0,0 C0.34,1.18 0.6,1 1,1');
```

En la coordenada de control `C0.34, 1.18`, el valor supera el 100% de la distancia (`1.18`) en el 60% del tiempo, generando un efecto de absorción de impacto elástico.

---

## 3. Flags Críticos de Rendimiento en `ScrollTrigger`

```javascript
scrollTrigger: {
  trigger: el,
  start: 'top 88%',
  once: true,            // 1. Desuscripción automática
  fastScrollEnd: true,   // 2. Anti-lag en scroll rápido
  invalidateOnRefresh: true // 3. Recálculo ante cambios de viewport
}
```

- **`once: true`**: Tan pronto la animación finaliza, ScrollTrigger destruye los listeners internos para ese nodo. Evita que el motor siga evaluando coordenadas en cada scroll subsiguiente.
- **`fastScrollEnd: true`**: Si el usuario realiza un scroll acelerado (*flick* en móviles), la animación salta instantáneamente a su estado final en lugar de quedarse atascada a medio camino.
- **`invalidateOnRefresh: true`**: Recalcula las posiciones de anclaje relativas al redimensionar la ventana o rotar el dispositivo.

---

## 4. Costo de Rendimiento & WPO (VRAM Optimization)

Las transformaciones 3D (`matrix3d`) fuerzan la creación de una **capa de composición separada** en la GPU. 

> [!WARNING]
> Dejar `will-change: transform` declarado indefinidamente en CSS mantiene bloques de memoria VRAM reservados permanentemente, degradando el rendimiento en teléfonos de gama media y baja.

### Estrategia de Mitigación:
1. Se declara `will-change: transform, opacity` al inicializar la animación.
2. En el callback `onComplete`, se restablece explícitamente a `will-change: auto`, devolviendo la memoria al navegador.

---

## 5. Accesibilidad (WCAG 2.1 AA)

```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

Si el sistema operativo tiene activada la reducción de movimiento, las transformaciones se desactivan y el contenido se renderiza estático y accesible.

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
