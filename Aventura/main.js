// Las reglas generan texto; las palabras entre < > insertan otra regla.
const gramatica = {
  pagina1: ["<atmosfera>\n\n<objetos>\n\n<revelacion>\n\n<lucesYsombras>"],
  pagina2Opcion1: ["<continuacion>\n\n<hallazgo>"],
  pagina2Opcion2: ["<exploracion>\n\n<pista>"],
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
  evento: ["'Gran Salvacion'", "la guerra nuclear", "dictadura de los caracoles"],
  lucesYsombras: [
    "La luz de 'La Gran torre' irradia todo a su alrededor. Una luz naranja destellante que cegaria a cualquiera que la mirara directamente. Las sombras de los edificios se alargaban y se mezclaban con la niebla <temp.temperatura>, creando un ambiente inquietante."
  ],
  continuacion: ["Escribe aquí qué sucede después de elegir el camino."],
  hallazgo: ["Escribe aquí qué encuentra o descubre el personaje."],
  exploracion: ["Escribe aquí qué encuentra el personaje al examinar el entorno."],
  pista: ["Escribe aquí qué nueva pista descubre."]
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
  pagina2Opcion1: { regla: "pagina2Opcion1", opciones: [] },
  pagina2Opcion2: { regla: "pagina2Opcion2", opciones: [] }
};

// Prepara el motor, la interfaz y la memoria de navegación.
const aventura = new Aventura("es").setGrammar(gramatica);
const historia = document.getElementById("historia");
const listaOpciones = document.getElementById("opciones");
const botonVolver = document.getElementById("volver");
const textosGuardados = Object.create(null);
const opcionesElegidas = Object.create(null);
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
    textosGuardados[id] = aventura.expandGrammar(pagina.regla);
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

// Gira la página, cambia su contenido mientras está oculta y muestra la nueva.
function cambiarPagina(id, retroceso = false) {
  if (cambiandoPagina) return;

  cambiandoPagina = true;
  historia.classList.toggle("retroceso", retroceso);
  historia.addEventListener("animationend", () => {
    mostrarPagina(id);
    historia.classList.replace("saliendo", "entrando");
    historia.addEventListener("animationend", () => {
      historia.classList.remove("entrando");
      cambiandoPagina = false;
    }, { once: true });
  }, { once: true });
  historia.classList.remove("entrando");
  historia.classList.add("saliendo");
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
