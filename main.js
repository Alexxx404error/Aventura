// ============================================================================
// 1. CONTENIDO DE LA HISTORIA (EDITA ESTA SECCIÓN PARA AMPLIARLA)
//
// Para añadir una página:
// 1) Crea aquí una regla con el texto, por ejemplo:
//      paginaNueva: ["<parrafoNuevo>"],
//      parrafoNuevo: ["Escribe aquí el texto de la historia."],
//    Separa párrafos con \n\n y usa <nombreRegla> para insertar otra regla.
// 2) Crea abajo una entrada `paginaNueva` en `paginas` y pon
//    regla: "paginaNueva".
// 3) Para ofrecer una decisión, rellena una opción con:
//      texto       = nombre que aparece junto al interruptor
//      descripcion = texto que acompaña a la opción junto al interruptor
//      destino     = nombre exacto de otra entrada de `paginas`
//    El interruptor admite hasta dos opciones: izquierda = opción 1 y
//    derecha = opción 2. Una página final usa opciones: [].
//
// Cada regla tiene una o más variantes entre [...]. Para reutilizar una
// elección de texto en otra regla, sigue el patrón $id$[variable:regla] y
// <id.variable> que se usa en las reglas existentes.
//
// PLANTILLA (cópiala y cambia los nombres/textos):
//   paginaNueva: ["<parrafoNuevo>"],
//   parrafoNuevo: ["Escribe aquí el texto."],
//   // En `paginas`:
//   paginaNueva: {
//     regla: "paginaNueva",
//     opciones: [
//       {
//         texto: "Continuar",
//         descripcion: "Explica brevemente esta decisión.",
//         destino: "paginaDestino"
//       }
//     ]
//   }
// Recuerda que `paginaDestino` también debe existir en `paginas`.
// ============================================================================

// Las palabras entre < > insertan otra regla.
const gramatica = {
  // Página inicial.
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

  // Rama de la primera decisión: intentar recordar.
  pagina2Opcion1: ["<continuacion>\n\n<hallazgo>"],
  continuacion: ["Te paras, mirando a tu alrededor intentas hacer memoria. Eres uno de los <yo.sobrevivientes> y quieres que <event.evento> suceda. No recuerdas cómo llegaste aquí, pero sabes que debes encontrar una manera de llevarlo a cabo."],
  hallazgo: [
    "Bajo una capa de papel mojado encuentras una insignia metálica con el símbolo de La Gran torre. Al tocarla, una voz casi olvidada murmura tu nombre."
  ],

  // Rama de la primera decisión: explorar el entorno.
  pagina2Opcion2: ["<exploracion>"],
  exploracion: ["$obj$[algo:algo]Mientras exploras, encuentras un <obj.algo> que te llama la atención."],
  algo: ["palo", "cofre", "mapa antiguo", "muñeco de trapo"],

  // Páginas finales compartidas por ambas ramas.
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

// ============================================================================
// 2. PÁGINAS Y DECISIONES (CONECTA AQUÍ LAS REGLAS DE ARRIBA)
// `regla` debe coincidir con una clave de `gramatica`.
// `destino` debe coincidir con una clave de `paginas`.
// ============================================================================
const paginas = {
  // Página de inicio.
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

  // Rama de la opción 1 de la página inicial.
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

  // Rama de la opción 2 de la página inicial.
  pagina2Opcion2: {
    regla: "pagina2Opcion2",
    opciones: [
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
    ]
  },

  // Finales: no tienen opciones.
  pagina3: { regla: "pagina3", opciones: [] },
  pagina4: { regla: "pagina4", opciones: [] }
};

// ============================================================================
// 3. MOTOR E INTERFAZ (NORMALMENTE NO HACE FALTA EDITAR DESDE AQUÍ)
// ============================================================================
const aventura = new Aventura("es").setGrammar(gramatica);
const historia = document.getElementById("historia");
const listaOpciones = document.getElementById("opciones");
const botonVolver = document.getElementById("volver");
const textosGuardados = Object.create(null);
const opcionesElegidas = Object.create(null);
const contextoHistoria = Object.create(null);
const ruta = ["pagina1"];
let cambiandoPagina = false;

// Crea los párrafos y el selector de caminos para la página indicada.
function mostrarPagina(id) {
  const pagina = paginas[id];
  if (!pagina) throw new Error(`No existe la página "${id}".`);
  if (!Object.prototype.hasOwnProperty.call(gramatica, pagina.regla)) {
    throw new Error(`No existe la regla "${pagina.regla}" para la página "${id}".`);
  }

  const textoYaCargado = Object.prototype.hasOwnProperty.call(textosGuardados, id);
  if (!textoYaCargado) {
    textosGuardados[id] = aventura.expandGrammar(pagina.regla, contextoHistoria);
  }

  let retraso = 0;
  const parrafos = textosGuardados[id]
    .split(/\n\s*\n/)
    .filter(texto => texto.trim())
    .map(texto => {
      const parrafo = document.createElement("p");
      if (textoYaCargado) {
        parrafo.textContent = texto.trim();
      } else {
        retraso = animarTexto(parrafo, texto.trim(), retraso);
      }
      return parrafo;
    });

  historia.replaceChildren(...parrafos);
  mostrarOpciones(id);
  botonVolver.hidden = ruta.length === 1;
}

// Desciende cada letra hasta su posición, con un breve desfase entre letras.
function animarTexto(parrafo, texto, retraso = 0) {
  if (typeof anime === "undefined") {
    parrafo.textContent = texto;
    return retraso;
  }

  const fragmento = document.createDocumentFragment();
  const palabras = texto.split(/(\s+)/);
  let cantidadLetras = 0;

  palabras.forEach(palabra => {
    if (/^\s+$/.test(palabra)) {
      fragmento.append(document.createTextNode(palabra));
      return;
    }

    const contenedorPalabra = document.createElement("span");
    contenedorPalabra.className = "palabra-animada";
    Array.from(palabra).forEach(caracter => {
      const letra = document.createElement("span");
      letra.className = "historia-letra";
      letra.textContent = caracter;
      contenedorPalabra.append(letra);
      cantidadLetras++;
    });
    fragmento.append(contenedorPalabra);
  });
  parrafo.append(fragmento);

  const duracion = 700;
  const intervalo = 12;
  anime({
    targets: parrafo.querySelectorAll(".historia-letra"),
    translateY: ["-1em", "0em"],
    opacity: [0, 1],
    duration: duracion,
    delay: anime.stagger(intervalo, { start: retraso }),
    easing: "easeOutCubic"
  });
  return retraso + intervalo * Math.max(cantidadLetras - 1, 0) + duracion + 120;
}

// Muestra un interruptor: izquierda elige la opción 1 y derecha la opción 2.
function mostrarOpciones(id) {
  const pagina = paginas[id];
  const elegida = opcionesElegidas[id];
  if (pagina.opciones.length > 2) {
    throw new Error(`La página "${id}" tiene más de dos opciones; el interruptor solo admite dos.`);
  }
  if (pagina.opciones.length === 0) {
    listaOpciones.replaceChildren();
    return;
  }

  const indiceElegida = elegida ? pagina.opciones.indexOf(elegida) : -1;
  const opcionIzquierda = elegida
    ? (indiceElegida === 0 ? elegida : null)
    : pagina.opciones[0];
  const opcionDerecha = elegida
    ? (indiceElegida === 1 ? elegida : null)
    : pagina.opciones[1] || null;

  const selector = document.createElement("div");
  selector.className = "selector-interruptor";

  const crearEtiqueta = (opcion, lado, sentido) => {
    const etiqueta = document.createElement("div");
    const nombre = document.createElement("strong");
    const descripcion = document.createElement("small");

    etiqueta.className = `interruptor-opcion interruptor-opcion--${lado}`;
    if (!opcion) etiqueta.classList.add("interruptor-opcion--inactiva");
    nombre.textContent = opcion
      ? `${sentido === "izquierda" ? "←" : "→"} ${opcion.texto}`
      : `${sentido === "izquierda" ? "←" : "→"} Sin opción`;
    descripcion.textContent = opcion
      ? opcion.descripcion
      : "No disponible en este recorrido.";
    etiqueta.append(nombre, descripcion);
    return etiqueta;
  };

  const izquierda = crearEtiqueta(opcionIzquierda, "izquierda", "izquierda");
  const derecha = crearEtiqueta(opcionDerecha, "derecha", "derecha");
  const control = document.createElement("div");
  const pista = document.createElement("div");
  const entrada = document.createElement("input");
  const mando = document.createElement("span");
  const ayuda = document.createElement("p");
  const idAyuda = `ayuda-interruptor-${id}`;

  control.className = "interruptor-control";
  pista.className = "interruptor-pista";
  entrada.className = "interruptor-selector";
  entrada.type = "range";
  entrada.min = elegida
    ? (indiceElegida === 1 ? "0" : "-1")
    : "-1";
  entrada.max = elegida
    ? (indiceElegida === 0 ? "0" : "1")
    : (pagina.opciones.length === 1 ? "0" : "1");
  entrada.step = "1";
  entrada.value = "0";
  entrada.setAttribute("aria-label", elegida
    ? `Gira hacia ${indiceElegida === 0 ? "la izquierda" : "la derecha"} para continuar por ${elegida.texto}`
    : "Interruptor de caminos: izquierda para la opción 1, derecha para la opción 2");
  entrada.setAttribute("aria-describedby", idAyuda);
  entrada.setAttribute("aria-valuetext", elegida
    ? `Continuar por ${elegida.texto}`
    : "Sin opción seleccionada");
  mando.className = "interruptor-mando";
  ayuda.id = idAyuda;
  ayuda.className = "ayuda-interruptor";
  ayuda.textContent = elegida
    ? `Mueve el interruptor hacia ${indiceElegida === 0 ? "la izquierda" : "la derecha"} para continuar por ${elegida.texto}.`
    : "Mueve el interruptor a la izquierda o a la derecha para elegir un camino.";

  entrada.addEventListener("input", () => {
    mando.style.left = `${(Number(entrada.value) + 1) * 50}%`;
  });
  entrada.addEventListener("change", () => {
    const posicion = Number(entrada.value);
    if (posicion === 0 || cambiandoPagina) return;

    const opcion = elegida || pagina.opciones[posicion < 0 ? 0 : 1];
    if (!opcion) return;

    const indice = pagina.opciones.indexOf(opcion);
    const sentido = indice === 0 ? "izquierda" : "derecha";
    entrada.disabled = true;
    if (typeof anime === "undefined") {
      elegirOpcion(id, opcion, sentido);
      return;
    }

    anime({
      targets: mando,
      rotate: sentido === "izquierda" ? "-=30deg" : "+=30deg",
      duration: 180,
      easing: "easeOutQuad",
      complete() {
        elegirOpcion(id, opcion, sentido);
      }
    });
  });

  control.append(entrada, pista, mando);
  selector.append(izquierda, control, derecha, ayuda);
  listaOpciones.replaceChildren(selector);
}

// Gira la página con valores relativos de Anime.js y cambia su contenido.
function cambiarPagina(id, sentido = "derecha") {
  if (cambiandoPagina) return;
  if (typeof anime === "undefined") {
    mostrarPagina(id);
    return;
  }

  cambiandoPagina = true;
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duracion = reducirMovimiento ? 120 : 500;
  const rotacion = sentido === "derecha" ? "+=85deg" : "-=85deg";
  const anguloEntrada = sentido === "derecha" ? -85 : 85;

  anime({
    targets: historia,
    rotateY: rotacion,
    opacity: 0,
    duration: duracion,
    easing: "easeInQuad",
    complete() {
      mostrarPagina(id);
      historia.style.opacity = "0";
      historia.style.transform = `perspective(1200px) rotateY(${anguloEntrada}deg)`;

      anime({
        targets: historia,
        rotateY: rotacion,
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
function elegirOpcion(idActual, opcion, sentido) {
  if (cambiandoPagina || (opcionesElegidas[idActual] && opcionesElegidas[idActual] !== opcion)) return;
  if (!paginas[opcion.destino]) {
    throw new Error(`No existe la página de destino "${opcion.destino}".`);
  }

  opcionesElegidas[idActual] = opcionesElegidas[idActual] || opcion;
  ruta.push(opcion.destino);
  cambiarPagina(opcion.destino, sentido);
}

// Retrocede en la ruta guardada, sin permitir cambiar las decisiones tomadas.
botonVolver.addEventListener("click", () => {
  if (cambiandoPagina || ruta.length === 1) return;
  const idAnterior = ruta[ruta.length - 2];
  const opcionAnterior = opcionesElegidas[idAnterior];
  const indiceOpcion = paginas[idAnterior].opciones.indexOf(opcionAnterior);
  const sentidoAnterior = indiceOpcion === 0 ? "izquierda" : "derecha";
  const sentidoRetroceso = sentidoAnterior === "izquierda" ? "derecha" : "izquierda";
  ruta.pop();
  cambiarPagina(ruta[ruta.length - 1], sentidoRetroceso);
});

mostrarPagina(ruta[0]);