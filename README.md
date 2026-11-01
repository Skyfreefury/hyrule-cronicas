# Hyrule · Crónicas interactivas

Web fan sobre el lore de *The Legend of Zelda*. HTML, CSS y JS sin build.

## Abrir

Doble clic en `index.html`, o con servidor local:

```bash
python -m http.server 5520
```

## Estructura

```
zelda/
├── index.html        Marcado de todas las secciones
├── DESIGN.md         Tokens de diseño (fuente: Refero Styles)
├── css/styles.css    Estilos
├── assets/hero/      Imagen del hero (IA, Figma gpt-image)
├── assets/regions/   Imágenes de regiones (aportadas por el autor)
├── assets/characters/ Retratos de personajes (IA, Figma gpt-image)
└── js/
    ├── data.js       Textos del lore (Trifuerza, cronología, regiones, personajes, test)
    ├── hero.js       Hero cinemático: capas de imagen, luz de la espada y polvo con GSAP ScrollTrigger
    ├── audio.js      Música generativa y efectos con Web Audio API
    └── lore.js       Secciones interactivas
```

## Cómo funciona el hero

- La sección se fija (pin) durante un 260% de scroll y una timeline GSAP con `scrub` avanza con la rueda.
- La misma imagen se apila en 3 capas: oscura (`brightness`), iluminada con máscara radial y brillo de la hoja con `mix-blend-mode: screen`.
- Con el scroll la hoja se enciende de la guarda a la punta, hay un destello y la luz revela a Link.
- Un canvas 2D dibuja polvo de luz con profundidad. El ratón inclina la escena para dar sensación 3D.
- La música y los efectos están compuestos en código con Web Audio y se sincronizan con la timeline.
- Con `prefers-reduced-motion` no hay pin y se muestra la imagen revelada.

## Cambiar imágenes por las del juego

Basta con sustituir los archivos manteniendo el nombre. No hace falta tocar código.

| Archivo | Uso | Formato recomendado |
|---|---|---|
| `assets/hero/link.jpg` | Hero | 16:9, fondo negro, espada vertical en el centro |
| `assets/map/hyrule.jpg` | Mapa real (sustituye al dibujo SVG) | Cualquier proporción, mínimo 1600 px de ancho |
| `assets/regions/<id>.jpg` | Foto de cada región | 16:10 horizontal |
| `assets/characters/<id>.jpg` | Carta de personaje | 3:4 vertical, cara en el tercio superior |

- Ids de región: `castillo`, `muerte`, `zora`, `gerudo`, `bosque`, `kakariko`, `hylia`, `orni`.
- Ids de personaje: `link`, `zelda`, `ganon`, `impa`.
- Hero: si la espada o la cara no caen en el mismo sitio, ajusta `--sx`, `--hilt` y `--face` en el `style` de `.shot` en `index.html`.
- Mapa: abre `index.html?editar`, arrastra los pines a su sitio y copia las coordenadas `mx`/`my` del cuadro de texto a `js/data.js`.
- Créditos: cambia `credit` (enlace) y `creditLabel` (texto) de cada región en `js/data.js`.
- Las imágenes oficiales son propiedad de Nintendo. Cítalas en el pie de página.

## Librerías

- GSAP 3.12.5 + ScrollTrigger (cdnjs)
- Lenis 1.1.13 para scroll suave (jsDelivr)
- Fuentes: Fraunces + Inter (Google Fonts)

Proyecto escolar sin afiliación con Nintendo.
