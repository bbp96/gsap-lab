# 03 — Animaciones en Bucle Desfasadas

Técnica de desincronización matemática de animaciones infinitas (`repeat: -1`, `yoyo: true`) mediante oscilaciones armónicas multieje con duraciones basadas en factores no coincidentes.

---

## 1. El Problema: El Efecto Robótico

Cuando múltiples elementos en una interfaz ejecutan un bucle con la misma duración y tiempo de inicio, el cerebro humano identifica de inmediato el patrón mecánico (*"Clockwork effect"*). Esto destruye la inmersión visual y genera fatiga cognitiva.

---

## 2. La Solución Matemática: Tres Oscilaciones por Nodo

En lugar de una animación simple, cada elemento recibe **tres tweens simultáneos** desacoplados, cuyas duraciones se calculan dinámicamente mediante el índice `i`:

```javascript
// 1. Flotación Vertical (Translación Y)
gsap.to(node, {
  y: -22,
  duration: 2.8 + i * 0.7,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

// 2. Rotación Alternada
gsap.to(node, {
  rotation: baseRot + (i % 2 === 0 ? 8 : -8),
  duration: 4.4 + i * 0.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

// 3. Respiración de Escala
gsap.to(node, {
  scale: 1.06,
  duration: 5.1 + i * 0.6,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});
```

---

## 3. Por qué Funciona: Desfase Periódico

Al combinar tres funciones sinusoidales con períodos distintos ($T_1 = 2.8s$, $T_2 = 4.4s$, $T_3 = 5.1s$), el Mínimo Común Múltiplo (MCM) de la repetición exacta supera los **70 segundos**. Para el usuario, el movimiento aparenta ser completamente no-lineal y orgánico.

---

## 4. Rendimiento & WPO

- **Zero Layout Shifts:** Las propiedades `y`, `rotation` y `scale` son procesadas íntegramente por la GPU a través de matrices de transformación (`transform: matrix(...)`), manteniendo el hilo principal libre para eventos de interacción.
- **Preferencia de Accesibilidad:** Se incluye verificación estricta de `prefers-reduced-motion` para suspender los bucles en caso de usuarios con sensibilidad vestibular.

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
