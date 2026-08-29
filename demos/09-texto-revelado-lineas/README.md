# 09 — Texto Revelado por Líneas sin Plugins de Pago

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Técnica:** Desglose Tipográfico en Vanilla JS · Máscaras CSS `overflow: hidden` · Alternativa a SplitText

---

## 🎯 El Problema en Producción

El efecto de texto que se desvela línea por línea desde una máscara inferior es uno de los recursos visuales más codiciados en landing pages de alto impacto (estilo Apple, Linear o Stripe).

El plugin oficial `SplitText` de GSAP está bloqueado bajo la suscripción de pago **Club GreenSock**. Muchos desarrolladores intentan resolver esto instalando librerías pesadas de terceros (como `SplitType`) que inflan el tamaño del bundle en varios kilobytes y provocan problemas de desalineación si las fuentes personalizadas tardan en cargar.

---

## 💡 La Solución con Vanilla JS y Máscaras CSS

Este enfoque construye el desglose directamente con JavaScript nativo:
1. Se divide el texto en segmentos (palabras o líneas).
2. Cada segmento se envuelve en dos niveles:
   - Contenedor exterior: `<span class="reveal-mask">` con `overflow: hidden` y `display: block` (o `inline-block`).
   - Contenedor interior: `<span class="reveal-inner">` que recibe la animación de GSAP.
3. Se anima `yPercent: 115` a `0` usando `power4.out` y `stagger`.

```javascript
function splitIntoLines(element, linesArray) {
  element.innerHTML = '';
  linesArray.forEach(lineText => {
    const mask = document.createElement('span');
    mask.className = 'reveal-mask'; // overflow: hidden; display: block;
    const inner = document.createElement('span');
    inner.className = 'reveal-inner';
    inner.textContent = lineText;
    mask.appendChild(inner);
    element.appendChild(mask);
  });
}

gsap.from('.reveal-inner', {
  yPercent: 115,
  opacity: 0,
  duration: 0.9,
  stagger: 0.12,
  ease: "power4.out"
});
```

---

## 🛡️ Criterio WPO y Accesibilidad

- **0 KB de Dependencias Adicionales:** Ahorro total de suscripciones y scripts externos.
- **Rendimiento GPU a 60 FPS:** Solo se anima la propiedad `transform` (`yPercent`), sin forzar recálculos de layout (`top` o `margin-top`).
- **Respeto a la Semántica:** Los elementos HTML mantienen su jerarquía semántica original (`<h1>`, `<h2>`, `<p>`).
