# 05 — Carga Condicional y Guard de Librerías con `requestAnimationFrame`

Patrón defensivo de sincronización para scripts inline o componentes diferidos que dependen de librerías asíncronas externas (GSAP, Swiper, Three.js), erradicando el uso de `setTimeout` ciegos y previniendo excepciones `ReferenceError`.

---

## 1. El Problema: Condiciones de Carrera en Bundles Asíncronos

En arquitecturas web modernas con scripts marcados como `defer`, `async` o inyectados dinámicamente mediante Web Components o constructores visuales, es frecuente que un fragmento de código JS dependiente intente ejecutarse antes de que la librería global haya terminado de parsearse en memoria:

```javascript
// ERROR TÍPICO:
// Uncaught ReferenceError: gsap is not defined
gsap.to('.card', { opacity: 1 });
```

### El Anti-Patrón Común: `setTimeout(fn, 300)`
1. **En redes lentas (3G/4G congestionada):** 300 ms resultan insuficientes; la librería aún no existe y el código colapsa igualmente.
2. **En redes rápidas o activos en caché:** El usuario es penalizado esperando 300 ms de latencia artificial innecesaria.

---

## 2. La Solución Arquitectónica: Guard de Frame Preciso

Se implementa una función recursiva de verificación enlazada estrictamente a la tasa de refresco del navegador mediante `requestAnimationFrame`:

```javascript
let framesChecked = 0;

function executeWhenReady() {
  framesChecked += 1;

  if (typeof window.gsap === 'undefined') {
    // Si la dependencia aún no existe, reintenta en el frame inmediato
    return requestAnimationFrame(executeWhenReady);
  }

  // Ejecución segura instantánea
  gsap.to('.card', { opacity: 1, y: 0, duration: 0.8 });
}

requestAnimationFrame(executeWhenReady);
```

---

## 3. Ventajas Técnicas

- **Latencia Cero:** Se ejecuta en el frame exacto (16.6 ms a 60 Hz) en que el objeto global se registra en el runtime.
- **Cero Bloqueo de Hilo Principal:** Al usar `requestAnimationFrame`, el navegador suspende la verificación si la pestaña pasa a segundo plano, evitando bucles de CPU descontrolados.

---

## Autor
**Benjamín Brante** — Desarrollador Web · Arquitectura Frontend & WPO  
[brante.dev](https://brante.dev) · [GitHub](https://github.com/bbp96/gsap-lab)
