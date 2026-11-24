// Las reglas generan texto; las palabras entre < > insertan otra regla.
const gramatica = {
  pagina1: ["<atmosfera>\n\n<objetos>\n\n<revelacion>\n\n<lucesYsombras>"],
  atmosfera: [
    "$temp$[temperatura:temperatura]$mod$[modificador:modificador]La vida es <temp.temperatura>, los callejones de la ciudad estaban <mod.modificador>. Nadie se atrevia a salir."
  ],
  temperatura: ["fria y humeda", "calida y sofocante"],
  modificador: ["desiertos", "abandonados", "llenos de sombras"],
  objetos: [
    "$cos$[cosas:cosas]Se hallaban <cos.cosas> <adjetivo> por todas partes, y un olor nauseabundo impregnaba el aire."
  ],
  cosas: ["gatos callejeros", "vagabundos", "carteles y graffitis en las paredes"],
  adjetivo: ["viejos", "asquerosos", "desgastados", "sucios", "descompuestos"],
  revelacion: [
    "$yo$[sobrevivientes:sobrevivientes] $event$[evento:evento]Eres uno de los <yo.sobrevivientes> de la <event.evento> y tienes un objetivo que no eres capaz de recordar."
  ],
  sobrevivientes: ["sobrevivientes", "testigos", "asesinos"],
  evento: ["'Gran Salvacion'", "guerra nuclear", "dictadura de los caracoles"],
  lucesYsombras: [
    "La luz de 'La Gran torre' irradia todo a su alrededor. Una luz naranja destellante que cegaria a cualquiera que la mirara directamente. Las sombras de los edificios se alargaban y se mezclaban con la niebla <temp.temperatura>, creando un ambiente inquietante."
  ],

  pagina2Opcion1: ["<continuacion>\n\n<hallazgo>"],
  continuacion: ["Te paras, mirando a tu alrededor intentas hacer memoria. Eres uno de los <yo.sobrevivientes> y quieres que <event.evento> suceda. No recuerdas cómo llegaste aquí, pero sabes que debes encontrar una manera de llevarlo a cabo."],
  hallazgo: [
    "Bajo una capa de papel mojado encuentras una insignia metálica con el símbolo de La Gran torre. Al tocarla, una voz casi olvidada murmura tu nombre."
  ],


  pagina2Opcion2: ["<exploracion>"],
  exploracion: ["$obj$[algo:algo]Mientras exploras, encuentras un <obj.algo> que te llama la atención."],
  algo: ["palo", "cofre", "mapa antiguo", "muñeco de trapo"],

  pagina3: [
    "<inspeccion>\n\n<decisionFinal>"
  ],
  inspeccion: [
    "El objeto guarda una llave antigua, cubierta de polvo y con una dirección grabada en su borde. Comprendes que esa llave puede abrir el acceso a La Gran torre."
  ],
  decisionFinal: [
    "Con el objeto en la mano, decides seguir la dirección antes de que las sombras te alcancen."
  ],

  pagina4: [
    "<exploracionFinal>\n\n<conclusion>"
  ],
  exploracionFinal: [
    "Dejas atrás el objeto extraño y sigues caminando. Tras varias calles, una grieta luminosa aparece en el suelo y revela una escalera que desciende hacia la ciudad olvidada."
  ],
  conclusion: [
    "Bajas por la escalera sabiendo que tu decisión ha cambiado el destino de los supervivientes."
  ],
};

// Cada página indica qué regla usar y qué destinos ofrece.
// Para añadir páginas, crea su regla en `gramatica`, su entrada aquí y conecta
// una opción cuyo `destino` coincida con el nombre de la nueva página.
const paginas = {
  pagina1: {
    regla: "pagina1",
    opciones: [
      {
        texto: "Opción 1",
        descripcion: "Intentar recordar quién eres y cómo llegaste aquí.",
        destino: "pagina2Opcion1"
      },
      {
        texto: "Opción 2",
        descripcion: "Examinar el entorno y buscar algo que te ayude a orientarte.",
        destino: "pagina2Opcion2"
      }
    ]
  },
  pagina2Opcion1: {
    regla: "pagina2Opcion1",
    opciones: [
      {
        texto: "Opción 1",
        descripcion: "Seguir la pista de tu memoria hasta La Gran torre.",
        destino: "pagina3"
      },
      {
        texto: "Opción 2",
        descripcion: "Abandonar las dudas y buscar a los supervivientes.",
        destino: "pagina4"
      }
    ]
  },
  pagina2Opcion2: { regla: "pagina2Opcion2", opciones: [
    {
      texto: "Opción 1",
      descripcion: "Tomar el objeto y examinarlo más de cerca.",
      destino: "pagina3"
    },
    {
      texto: "Opción 2",
      descripcion: "Ignorar el objeto y continuar por tu camino.",
      destino: "pagina4"
    }

  ] },
  pagina3: { regla: "pagina3", opciones: [] },
  pagina4: { regla: "pagina4", opciones: [] }
};

// Prepara el motor, la interfaz y la memoria de navegación.
const aventura = new Aventura("es").setGrammar(gramatica);
const historia = document.getElementById("historia");
const listaOpciones = document.getElementById("opciones");
const botonVolver = document.getElementById("volver");
const textosGuardados = Object.create(null);
const opcionesElegidas = Object.create(null);
const contextoHistoria = Object.create(null);
const ruta = ["pagina1"];
let cambiandoPagina = false;

// Crea los párrafos y botones para la página indicada.
function mostrarPagina(id) {
  const pagina = paginas[id];
  if (!pagina) throw new Error(`No existe la página "${id}".`);
  if (!Object.prototype.hasOwnProperty.call(gramatica, pagina.regla)) {
    throw new Error(`No existe la regla "${pagina.regla}" para la página "${id}".`);
  }

  if (!Object.prototype.hasOwnProperty.call(textosGuardados, id)) {
    textosGuardados[id] = aventura.expandGrammar(pagina.regla, contextoHistoria);
  }

  const parrafos = textosGuardados[id]
    .split(/\n\s*\n/)
    .filter(texto => texto.trim())
    .map(texto => {
      const parrafo = document.createElement("p");
      parrafo.textContent = texto.trim();
      return parrafo;
    });

  historia.replaceChildren(...parrafos);
  mostrarOpciones(id);
  botonVolver.hidden = ruta.length === 1;
}

// Muestra todas las opciones disponibles o solo la ruta ya elegida al volver.
function mostrarOpciones(id) {
  const pagina = paginas[id];
  const elegida = opcionesElegidas[id];
  const opciones = elegida ? [elegida] : pagina.opciones;

  listaOpciones.replaceChildren(...opciones.map((opcion, indice) => {
    const contenedor = document.createElement("span");
    const boton = document.createElement("button");
    const ayuda = document.createElement("span");
    const idAyuda = `ayuda-${id}-${indice}`;

    contenedor.className = "opcion";
    boton.type = "button";
    boton.textContent = elegida ? `Continuar por ${opcion.texto}` : opcion.texto;
    boton.setAttribute("aria-describedby", idAyuda);
    boton.addEventListener("click", () => elegirOpcion(id, opcion));
    ayuda.id = idAyuda;
    ayuda.className = "menu-opcion";
    ayuda.setAttribute("role", "tooltip");
    ayuda.textContent = opcion.descripcion;
    contenedor.append(boton, ayuda);
    return contenedor;
  }));
}

// Gira la página con Anime.js y cambia su contenido al terminar la salida.
function cambiarPagina(id, retroceso = false) {
  if (cambiandoPagina) return;
  if (typeof anime === "undefined") {
    mostrarPagina(id);
    return;
  }

  cambiandoPagina = true;
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duracion = reducirMovimiento ? 120 : 500;
  const anguloSalida = retroceso ? 85 : -85;
  const anguloEntrada = retroceso ? -85 : 85;

  anime({
    targets: historia,
    rotateY: anguloSalida,
    opacity: 0,
    duration: duracion,
    easing: "easeInQuad",
    complete() {
      mostrarPagina(id);
      historia.style.opacity = "0";
      historia.style.transform = `perspective(1200px) rotateY(${anguloEntrada}deg)`;

      anime({
        targets: historia,
        rotateY: 0,
        opacity: 1,
        duration: duracion,
        easing: "easeOutQuad",
        complete() {
          historia.style.transform = "";
          cambiandoPagina = false;
        }
      });
    }
  });
}

// Cada página solo permite elegir un camino; la elección queda guardada.
function elegirOpcion(idActual, opcion) {
  if (cambiandoPagina || (opcionesElegidas[idActual] && opcionesElegidas[idActual] !== opcion)) return;
  if (!paginas[opcion.destino]) {
    throw new Error(`No existe la página de destino "${opcion.destino}".`);
  }

  opcionesElegidas[idActual] = opcionesElegidas[idActual] || opcion;
  ruta.push(opcion.destino);
  cambiarPagina(opcion.destino);
}

// Retrocede en la ruta guardada, sin permitir cambiar las decisiones tomadas.
botonVolver.addEventListener("click", () => {
  if (cambiandoPagina || ruta.length === 1) return;
  ruta.pop();
  cambiarPagina(ruta[ruta.length - 1], true);
});

mostrarPagina(ruta[0]);