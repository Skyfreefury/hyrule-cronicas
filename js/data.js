// Contenido del lore. Se carga como script (sin fetch) para que la web funcione abriendo index.html.
window.LORE = {
  triforce: {
    poder: {
      title: "Trifuerza del Poder",
      bearer: "Portador: Ganondorf",
      goddess: "Diosa Din, que dio forma a la tierra.",
      text: "Concede una fuerza casi ilimitada. Ganondorf, rey de los gerudo, la reclama una y otra vez, y con ella resiste a cada héroe."
    },
    sabiduria: {
      title: "Trifuerza de la Sabiduría",
      bearer: "Portadora: la princesa Zelda",
      goddess: "Diosa Nayru, que dio la ley al mundo.",
      text: "Otorga conocimiento y poder sellador. Las princesas de la familia real la heredan y la usan para encerrar al mal."
    },
    valor: {
      title: "Trifuerza del Valor",
      bearer: "Portador: Link",
      goddess: "Diosa Farore, que creó la vida.",
      text: "Elige a quien no se rinde. Link, un chico corriente de cada era, la recibe y empuña la Espada Maestra."
    }
  },

  timeline: {
    origen: {
      label: "Origen",
      desc: "Antes del gran cisma: nace la Espada Maestra y empieza el ciclo entre el héroe, la princesa y el mal.",
      games: [
        { t: "Skyward Sword", y: 2011, b: "El origen de todo. Link y Zelda viven sobre las nubes. La espada Fi se convierte en la Espada Maestra y Demise lanza la maldición que repite la historia." },
        { t: "The Minish Cap", y: 2004, b: "Link se encoge para hablar con los minish y frena al hechicero Vaati, que convirtió a Zelda en piedra." },
        { t: "Four Swords", y: 2002, b: "La Espada de los Cuatro divide a Link en cuatro copias para volver a sellar a Vaati." },
        { t: "Ocarina of Time", y: 1998, b: "Ganondorf busca la Trifuerza. Link viaja siete años al futuro y lo derrota. Su desenlace parte la cronología en tres." }
      ]
    },
    adulto: {
      label: "Héroe adulto",
      desc: "Link vence y Zelda lo devuelve a su infancia. El futuro que deja atrás se queda sin héroe.",
      games: [
        { t: "The Wind Waker", y: 2002, b: "Ganon regresa y las diosas inundan Hyrule. Siglos después, un nuevo Link navega el Gran Mar con la pirata Tetra." },
        { t: "Phantom Hourglass", y: 2007, b: "Justo después de Wind Waker: Link persigue un barco fantasma para rescatar a Tetra." },
        { t: "Spirit Tracks", y: 2009, b: "Un siglo después, en un nuevo reino. Link es maquinista de tren y el espíritu de Zelda lo acompaña." }
      ]
    },
    nino: {
      label: "Héroe niño",
      desc: "El Link que vuelve al pasado avisa de Ganondorf antes de que actúe. Esta rama sigue al niño.",
      games: [
        { t: "Majora's Mask", y: 2000, b: "Link busca a Navi y acaba en Términa. Tiene tres días antes de que la luna caiga." },
        { t: "Twilight Princess", y: 2006, b: "El Crepúsculo cubre Hyrule. Link se transforma en lobo y viaja con Midna." },
        { t: "Four Swords Adventures", y: 2004, b: "Un nuevo Ganondorf nace entre los gerudo y roba el Tridente. Vuelven las cuatro copias de Link." }
      ]
    },
    caida: {
      label: "Caída del héroe",
      desc: "La rama donde Link pierde ante Ganon. El mal queda sellado en el Reino Sagrado, que se pudre en un Mundo Oscuro.",
      games: [
        { t: "A Link to the Past", y: 1991, b: "Ganon reina en el Mundo Oscuro. Link salta entre dos mundos para liberar a los descendientes de los sabios." },
        { t: "Oracle of Seasons / Ages", y: 2001, b: "La Trifuerza envía a Link a Holodrum y Labrynna, donde las estaciones y el tiempo se rompen." },
        { t: "Link's Awakening", y: 1993, b: "Link naufraga en la isla Koholint y debe despertar al Pez del Viento." },
        { t: "A Link Between Worlds", y: 2013, b: "Lorule es el reflejo de Hyrule. Link puede fundirse con las paredes como un dibujo." },
        { t: "Tri Force Heroes", y: 2015, b: "Tres Links salvan Hytopia de una bruja que maldijo a su princesa con un traje horrible." },
        { t: "The Legend of Zelda", y: 1986, b: "El primer juego: reunir los ocho fragmentos de la Trifuerza de la Sabiduría." },
        { t: "Zelda II: The Adventure of Link", y: 1987, b: "Link despierta a una Zelda dormida desde hace siglos." }
      ]
    },
    despertar: {
      label: "Despertar",
      desc: "Tan lejos en el futuro que las tres ramas se funden en leyenda. Su posición exacta sigue sin confirmarse.",
      games: [
        { t: "Breath of the Wild", y: 2017, b: "Link despierta tras cien años de sueño. La Calamidad Ganon rodea el castillo y Zelda la contiene sola." },
        { t: "Tears of the Kingdom", y: 2023, b: "Ganondorf despierta bajo el castillo. Hyrule se extiende a islas del cielo y a un subsuelo oscuro." }
      ]
    }
  },

  regions: [
    { id: "castillo", mx: 49, my: 40, photo: "assets/regions/castillo.jpg", name: "Castillo de Hyrule", x: 400, y: 216, people: ["Familia real", "Caballeros"],
      text: "Corazón del reino y sede de la familia real. En casi todas las eras es el primer objetivo de Ganon." },
    { id: "muerte", mx: 78, my: 22, photo: "assets/regions/muerte.jpg", name: "Montaña de la Muerte", x: 610, y: 120, people: ["Gorons"],
      text: "Volcán activo al norte. Los gorons viven en sus túneles, comen rocas y forjan las mejores armas." },
    { id: "zora", mx: 90, my: 46, photo: "assets/regions/zora.jpg", name: "Dominio Zora", x: 720, y: 240, people: ["Zoras"],
      text: "Pueblo acuático que guarda las fuentes del reino. Sus princesas, como Ruto o Mipha, ayudan al héroe." },
    { id: "gerudo", mx: 30, my: 82, photo: "assets/regions/gerudo.jpg", name: "Desierto Gerudo", x: 140, y: 350, people: ["Gerudos"],
      text: "Tribu de guerreras del oeste. Según la leyenda, cada cien años nace un varón destinado a ser su rey: así llega Ganondorf." },
    { id: "bosque", mx: 56, my: 26, photo: "assets/regions/bosque.jpg", name: "Bosque Perdido", x: 630, y: 360, people: ["Kokiris", "Koroks"],
      text: "Quien se pierde aquí sin guía se convierte en criatura del bosque. En varias eras oculta la Espada Maestra." },
    { id: "kakariko", mx: 73, my: 63, photo: "assets/regions/kakariko.jpg", name: "Aldea Kakariko", x: 520, y: 260, people: ["Sheikah"],
      text: "Refugio de los sheikah, el clan de sombras que protege a la familia real. Impa es su figura más conocida." },
    { id: "hylia", mx: 50, my: 79, photo: "assets/regions/hylia.jpg", name: "Lago Hylia", x: 392, y: 430, people: ["Hylianos", "Zoras"],
      text: "Gran lago del sur, nombrado por la diosa Hylia. Bajo sus aguas descansa un templo." },
    { id: "orni", mx: 28, my: 42, photo: "assets/regions/orni.jpg", name: "Aldea Orni", x: 190, y: 170, people: ["Ornis"],
      text: "Pueblo de los orni, gente pájaro del oeste de Tabanta. Viven en una aguja de roca sobre un lago y son los mejores arqueros del reino." }
  ],

  characters: [
    { id: "link", name: "Link", role: "El héroe elegido", tag: "Valor", piece: "valor",
      facts: ["No es una sola persona: es un alma que renace en cada era.", "Casi nunca habla en los juegos: el jugador pone la voz.", "Clásicamente es zurdo."] },
    { id: "zelda", name: "Zelda", role: "Princesa de Hyrule", tag: "Sabiduría", piece: "sabiduria",
      facts: ["Desciende de la diosa Hylia, que renació como mortal.", "Ha sido Sheik, Tetra y espíritu sin cuerpo.", "El nombre del juego es suyo, no de Link."] },
    { id: "ganon", name: "Ganondorf", role: "Rey del Mal", tag: "Poder", piece: "poder",
      facts: ["Su forma bestial se llama Ganon.", "Encarna el odio de Demise, sellado en el origen.", "Fue rey de los gerudo antes de corromperse."] },
    { id: "impa", name: "Impa", role: "Guardiana sheikah", tag: "Sombra", piece: null,
      facts: ["Protege a Zelda desde Skyward Sword.", "Fundó la aldea Kakariko en Ocarina of Time.", "En Breath of the Wild es una anciana de más de cien años."] }
  ],

  quiz: [
    { q: "Ves un monstruo bloqueando el puente. ¿Qué haces?",
      a: [["Lo aparto a la fuerza", "poder"], ["Busco otro camino o un truco", "sabiduria"], ["Me planto delante, aunque tiemble", "valor"]] },
    { q: "¿Qué objeto te llevas a la aventura?",
      a: [["Un martillo enorme", "poder"], ["Un libro de hechizos", "sabiduria"], ["Un escudo viejo", "valor"]] },
    { q: "Al final del viaje quieres...",
      a: [["Que nadie vuelva a mandarme", "poder"], ["Entender por qué pasó todo", "sabiduria"], ["Volver a casa con mis amigos", "valor"]] }
  ],

  // Mito de origen, tal como lo cuenta Skyward Sword.
  origin: [
    { t: "Las tres diosas", s: "Antes del tiempo",
      b: "Din dio forma a la tierra con sus brazos de fuego. Nayru le dio orden y leyes. Farore creó la vida que la habita. Al marcharse, dejaron atrás la Trifuerza, capaz de cumplir cualquier deseo." },
    { t: "Hylia, la guardiana", s: "La era de la diosa",
      b: "Una cuarta diosa, Hylia, quedó a cargo de la reliquia y de los humanos de la superficie. Ellos la veneraban, y su nombre acabó dando nombre a todo un pueblo: los hylianos." },
    { t: "La guerra contra Demise", s: "La primera calamidad",
      b: "Demise, rey de los demonios, surgió de la tierra con un ejército para robar la Trifuerza. Hylia elevó una porción de tierra con los humanos por encima de las nubes y, con ayuda de un guerrero, selló al demonio." },
    { t: "El sacrificio de Hylia", s: "Nace la primera Zelda",
      b: "Las diosas no pueden usar la Trifuerza: solo un mortal puede. Por eso Hylia renunció a su divinidad y renació como humana. Así nació la primera Zelda, que junto al primer Link destruyó a Demise para siempre." },
    { t: "La maldición eterna", s: "Por qué la historia se repite",
      b: "Antes de desaparecer, Demise juró que su odio renacería una y otra vez para perseguir a la sangre de Hylia y al espíritu del héroe. Ese odio es Ganon. Por eso cada era tiene su Link, su Zelda y su rey del mal." }
  ],

  // Pueblos de Hyrule. region enlaza con el pin del mapa.
  races: [
    { id: "hylianos", name: "Hylianos", region: "castillo", home: "Castillo de Hyrule y llanuras",
      traits: ["Orejas puntiagudas: la leyenda dice que les permiten oír la voz de los dioses.", "Pueblo más numeroso del reino.", "La familia real desciende de la diosa Hylia."],
      famous: ["Link", "Zelda", "Rey Rhoam"],
      fact: "Link y Zelda son hylianos en casi todas las entregas, aunque en Skyward Sword viven en Altárea, sobre las nubes." },
    { id: "gorons", name: "Gorons", region: "muerte", home: "Montaña de la Muerte",
      traits: ["Cuerpo de roca, resisten el calor de la lava.", "Comen piedras: las de la Montaña de la Muerte son su manjar.", "Se desplazan rodando como bolas."],
      famous: ["Darunia", "Daruk", "Yunobo"],
      fact: "Llaman «hermano» a quien se gana su respeto. Link recibe ese título en más de una aventura." },
    { id: "zoras", name: "Zoras", region: "zora", home: "Dominio Zora",
      traits: ["Pueblo acuático que guarda los ríos y manantiales.", "Muy longevos: algunos viven siglos.", "Forjan armas con escamas y metales que no se oxidan."],
      famous: ["Ruto", "Mipha", "Sidon"],
      fact: "En la cronología del héroe adulto, tras la inundación de Hyrule, los zoras evolucionaron hasta convertirse en los orni." },
    { id: "orni", name: "Orni", region: "orni", home: "Aldea Orni, en Tabanta",
      traits: ["Pueblo pájaro: vuelan gracias a sus alas.", "Los mejores arqueros del reino.", "Famosos por su música y sus canciones."],
      famous: ["Medli", "Revali", "Teba"],
      fact: "En Wind Waker los jóvenes orni reciben sus alas de una escama del dragón Valoo." },
    { id: "gerudos", name: "Gerudos", region: "gerudo", home: "Desierto Gerudo",
      traits: ["Tribu de guerreras del desierto del oeste.", "Casi todas son mujeres: cada cien años nace un varón destinado a ser rey.", "Expertas en espadas curvas y en el comercio."],
      famous: ["Nabooru", "Urbosa", "Riju"],
      fact: "Ganondorf fue ese varón destinado a reinar. Su caída marcó a su pueblo durante siglos." },
    { id: "sheikah", name: "Sheikah", region: "kakariko", home: "Aldea Kakariko",
      traits: ["Clan de sombras jurado a proteger a la familia real.", "Su símbolo es un ojo con una lágrima.", "Crearon una tecnología antigua capaz de enfrentarse a Ganon."],
      famous: ["Impa", "Sheik", "Purah"],
      fact: "Una parte del clan traicionó a la corona y formó el clan Yiga, que sirve a Ganon." },
    { id: "kokiri", name: "Kokiri y Koroks", region: "bosque", home: "Bosque Perdido",
      traits: ["Niños que nunca crecen, protegidos por el Gran Árbol Deku.", "Cada uno vive acompañado de un hada.", "Si salen del bosque, se dice que mueren."],
      famous: ["Saria", "Mido", "Hestu"],
      fact: "En la cronología del héroe adulto, los kokiri se transformaron en koroks: pequeños espíritus del bosque con cara de hoja." }
  ],

  // Reliquias legendarias.
  relics: [
    { id: "espada", name: "Espada Maestra", sub: "La espada que destierra el mal",
      origin: "Nació como la Espada de la Diosa en Skyward Sword y se templó con tres llamas sagradas. Fi es el espíritu que vive en ella.",
      power: "Solo el héroe elegido puede empuñarla. Ganon no soporta su poder sagrado.",
      games: "Ocarina of Time, A Link to the Past, Twilight Princess, Breath of the Wild y muchos más." },
    { id: "escudo", name: "Escudo Hyliano", sub: "El emblema de la familia real",
      origin: "Escudo de la guardia real, con el pájaro de la Trifuerza y el ala de la diosa.",
      power: "Casi indestructible. En Breath of the Wild es el escudo más resistente del juego.",
      games: "Ocarina of Time, Twilight Princess, Breath of the Wild, Tears of the Kingdom." },
    { id: "ocarina", name: "Ocarina del Tiempo", sub: "Un tesoro de la familia real",
      origin: "Zelda se la entrega a Link antes de huir del castillo.",
      power: "Con las canciones adecuadas abre la Puerta del Tiempo, cambia el día por la noche y transporta a templos lejanos.",
      games: "Ocarina of Time y Majora's Mask." },
    { id: "trifuerza", name: "Trifuerza", sub: "El deseo de las diosas",
      origin: "Las tres diosas la dejaron al terminar de crear el mundo.",
      power: "Si alguien con el corazón equilibrado la toca, cumple su deseo. Si no, se divide en Poder, Sabiduría y Valor.",
      games: "Presente en casi toda la saga." },
    { id: "piedra", name: "Piedra Sheikah", sub: "Tecnología de otra era",
      origin: "Tablilla creada por los antiguos sheikah, hace diez mil años.",
      power: "Contiene runas: crear bloques de hielo, mover metal, detener el tiempo de un objeto o hacer bombas.",
      games: "Breath of the Wild." },
    { id: "arco", name: "Flechas de luz", sub: "La luz que hiere al mal",
      origin: "Poder sagrado ligado a la sangre de la diosa. Zelda suele ser quien lo invoca.",
      power: "Es una de las pocas armas capaces de herir de verdad a Ganon en el combate final.",
      games: "Ocarina of Time, Wind Waker, Twilight Princess, Breath of the Wild." }
  ]
};
