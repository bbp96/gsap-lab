# 11 — Benchmark en Vivo: `transform` vs. `top` / `left`

> **Autor:** Benjamín Brante — Desarrollador Web (Frontend, WordPress & WPO)  
> **Técnica:** Medición de Pipeline del Navegador · Reflow vs Composite · Benchmark en Tiempo Real

---

## 🎯 El Problema en Producción

Muchos tutoriales y desarrolladores novatos mueven elementos modificando propiedades CSS como `top`, `left`, `margin` o `width`. En proyectos con pocos elementos esto parece funcionar, pero en interfaces reales (dashboards, sliders, efectos de partículas o landing pages complejas) provoca caídas abruptas de rendimiento (**Jank**).

### La razón técnica:
El pipeline de renderizado de un motor web (Blink/Gecko/WebKit) consta de tres etapas:
1. **Layout (Reflow):** El navegador calcula la geometría y posición espacial de cada nodo en el árbol del DOM.
2. **Paint (Repaint):** El navegador rellena los píxeles en capas de memoria.
3. **Composite:** La GPU junta todas las capas y las envía a la pantalla.

Animar `top` o `left` fuerza al navegador a ejecutar **Layout + Paint + Composite en el hilo principal de la CPU 60 veces por segundo**.

---

## 💡 La Solución con `transform` (GPU Compositor)

Al usar `transform: translate3d(x, y, 0)` o los alias de GSAP `x` e `y`:
- El navegador **salta completamente las fases de Layout y Paint**.
- La capa es procesada exclusivamente por el hilo del compositor en la GPU.
- El hilo principal de JavaScript queda 100% libre para responder a eventos de usuario sin latencia (INP y TBT en 0 ms).

```javascript
// ❌ MALA PRÁCTICA (Fuerza Layout y Reflow 60 veces/s)
gsap.to('.elemento', {
  top: '200px',
  left: '300px'
});

// ✅ ESTÁNDAR SENIOR (Directo a la GPU, 0 ms de bloqueo de CPU)
gsap.to('.elemento', {
  y: 200,
  x: 300,
  force3D: true
});
```

---

## 📊 Métricas Medidas en el Benchmark

| Métrica | Modo Layout (`top`/`left`) | Modo GPU (`transform`) |
| :--- | :--- | :--- |
| **Tasa de Cuadros** | 15 - 35 FPS (Tirones visibles) | **60 FPS Constantes** |
| **Tiempo de CPU por Frame** | 18 - 35 ms (> 16.6ms límite) | **< 1.0 ms** |
| **Reflows Forzados** | 80 por cada frame | **0 por frame** |
| **Consumo de Batería** | Alto (CPU al 100%) | Mínimo (Aceleración por HW) |
