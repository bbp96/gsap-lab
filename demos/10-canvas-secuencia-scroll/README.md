# 10 — Canvas con Secuencia de Frames Controlado por Scroll

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Técnica:** HTML5 Canvas 2D · ScrollTrigger `scrub` · Interpolación Cinemática a 60 FPS

---

## 🎯 El Problema en Producción

El efecto visual de desplazar el scroll para rotar un producto en 360° o desarmar un dispositivo tecnológico (popularizado por Apple en landing pages de AirPods y MacBooks) suele implementarse de forma ingenua cambiando el atributo `src` de una etiqueta `<img>` en cada tick de scroll.

Esto causa:
1. **Parpadeos blancos (Flickering):** El navegador no alcanza a decodificar la imagen antes de pintarla.
2. **Layout Thrashing:** Cada cambio de imagen puede provocar recálculos dimensionales en el árbol de renderizado.
3. **Consumo excesivo de memoria:** Cargar 100 imágenes desordenadas en el DOM agota la memoria RAM del dispositivo móvil.

---

## 💡 La Solución con HTML5 Canvas y ScrollTrigger

Una implementación limpia utiliza un único elemento `<canvas>`:
- **Interpolación en memoria:** Un objeto numérico (`sequence = { frame: 0 }`) se anima mediante GSAP con `scrollTrigger: { scrub: 0.5 }`.
- **Renderizado directo en GPU:** En el callback `onUpdate`, el frame se dibuja directamente sobre el contexto 2D del Canvas (`ctx.drawImage()` o cálculo vectorial en microsegundos).
- **Cero parpadeo:** El buffer de dibujo se actualiza de forma síncrona con el refresco de pantalla del monitor (V-Sync).

```javascript
const canvas = document.getElementById('sequenceCanvas');
const ctx = canvas.getContext('2d');
const sequence = { frame: 0 };

gsap.to(sequence, {
  frame: 120,
  ease: 'none',
  scrollTrigger: {
    trigger: '#scrollContainer',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: () => {
      drawFrame(Math.round(sequence.frame));
    }
  }
});
```

---

## 🛡️ Criterio WPO y Buenas Prácticas

- **Cero Reflows:** El nodo `<canvas>` tiene dimensiones estáticas; no genera saltos de layout (Zero CLS).
- **Tasa de Refresco Estable:** Corre a 60 FPS fijos incluso en teléfonos de gama media.
- **Liberación de Memoria:** Al cambiar de página, se limpia el contexto y no quedan cientos de nodos de imagen en memoria.
