# 06 — Recálculo de Triggers con Imágenes Diferidas & Zero CLS

Solución en dos capas para prevenir el descalibre de coordenadas de `ScrollTrigger` ante la carga asíncrona de imágenes (`loading="lazy"`), garantizando **Cumulative Layout Shift (CLS) = 0.000**.

---

## 1. El Bug Silencioso

Cuando una página web implementa `loading="lazy"` en imágenes sin dimensiones explícitas:
1. `ScrollTrigger` inicializa y calcula las posiciones absolutas (`start` y `end`) de cada animación basándose en la altura actual del documento.
2. A medida que el usuario hace scroll, las imágenes se descargan y expanden repentinamente la altura de la página (Layout Shift).
3. **El fallo:** Las coordenadas previamente calculadas quedan desplazadas cientos de píxeles, provocando que las animaciones se disparen a destiempo o nunca ocurran.

---

## 2. La Solución en Dos Capas

### Capa 1: Prevención en CSS (Zero CLS)
La propiedad CSS `aspect-ratio` reserva el espacio exacto del contenedor antes de recibir el primer byte de la imagen:

```css
.media-box {
  width: 100%;
  aspect-ratio: 16 / 9; /* Reserva dimensional instantánea */
}
```

Esto previene el salto visual y mantiene la métrica CLS de Google Core Web Vitals en **0.000**.

---

### Capa 2: Red de Seguridad JS (`ScrollTrigger.refresh()`)
Para imágenes dinámicas con proporciones desconocidas, nos suscribimos al evento `load` de cada elemento pendiente:

```javascript
document.querySelectorAll('img').forEach((img) => {
  if (!img.complete) {
    img.addEventListener('load', () => {
      ScrollTrigger.refresh(); // ← Recalcula todos los offsets globales
    }, { once: true }); // Desuscripción atómica automática
  }
});
```

---

## 3. Flag Esencial: `invalidateOnRefresh: true`

En las definiciones de las animaciones individuales, se declara obligatoriamente `invalidateOnRefresh: true`:

```javascript
gsap.from(card, {
  y: 40,
  autoAlpha: 0,
  scrollTrigger: {
    trigger: card,
    start: 'top 85%',
    once: true,
    invalidateOnRefresh: true // Borra valores cacheados obsoletos tras refresh()
  }
});
```

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
