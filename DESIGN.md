# Hyrule — DESIGN.md

Adaptado de la ficha de Refero "General Intelligence Company"
(https://styles.refero.design/style/34baa524-5d5b-4165-bbab-d01f05e6d6b9):
escenas pintadas a pantalla completa que alternan con páginas de papel limpias.
Motion y checklist de accesibilidad: skill `ui-ux-pro-max` (presets GSAP "Scroll Reveal / Complex").

## Colores

| Token | Valor | Uso |
|---|---|---|
| `--night` | `#0d1620` | Fondo del hero y del mapa |
| `--dusk` | `#1f1f29` | Botón relleno, tarjetas oscuras |
| `--twilight` | `#282834` | Bordes de nav y acciones |
| `--parchment` | `#fbfaf4` | Lienzo de las secciones claras |
| `--paper` | `#ffffff` | Tarjetas |
| `--linen` | `#f3f1e8` | Superficies suaves |
| `--graphite` | `#2c2c2c` | Titulares |
| `--charcoal` | `#444141` | Texto de cuerpo |
| `--ash` | `#646464` | Texto secundario |
| `--mist` | `#dee2de` | Bordes de 1px (firma visual) |
| `--sheikah` | `#41a1cf` | Acento único: solo bordes y enlaces, nunca relleno |
| `--gold` | `#c9a64a` | Trifuerza: puntuación rara, como el "Cerulean" de la referencia |

## Tipografía

- Display: Fraunces 400 (sustituto oficial de ppmondwest). Nunca 600+. Interlineado 1.1, tracking -0.02em.
- UI y cuerpo: Inter 400/500, 15 a 18px, interlineado 1.5.

## Forma

- Botones 8px, tarjetas 12 a 16px, superficies grandes 24px, nav en píldora.
- Sin sombras en botones. Bordes de 1px `--mist`.
- Ancho máximo 1200px, secciones con 96px de aire vertical.

## Motion

- Hero fijado (pin) 1 sola vez, `scrub: 1`, 300% de recorrido.
- Revelados: y 16px, 0.5s, `power2.out`.
- `prefers-reduced-motion`: sin pin, se muestra el estado final.
