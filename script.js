
const cards = document.querySelectorAll(".ace-card");
const modal = document.getElementById("card-modal");
const closeButton = document.getElementById("modal-close");

const explanations = [
  "Durante un minuto, todos los puntos que consiga tu equipo cuentan doble. Los efectos de puntuación doble no se acumulan.",
  "Durante un minuto, el equipo rival debe jugar con un jugador menos.",
  "Permite elegir cualquiera de las otras seis cartas especiales y aplicar su efecto.",
  "Permite ver las cartas no utilizadas del rival, elegir una y robarla para aplicar su efecto inmediatamente.",
  "Durante un minuto, tu propio equipo debe jugar sin utilizar las manos.",
  "Durante un minuto, tu equipo puede dejar que el balón bote una vez en su campo sin perder automáticamente el punto.",
  "Durante un minuto, tu propio equipo no puede sumar puntos al marcador. El rival sí puede seguir puntuando."
];

cards.forEach((card, index) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");

  function openCard() {
    document.getElementById("modal-title").textContent =
      card.querySelector("h3").textContent;

    document.getElementById("modal-description").textContent =
      explanations[index];

    document.getElementById("modal-duration").textContent =
      card.querySelector("strong").textContent;

    modal.hidden = false;
    closeButton.focus();
  }

  card.addEventListener("click", openCard);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCard();
    }
  });
});

function closeModal() {
  modal.hidden = true;
}

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});


/* ===================================
   ACE CUP - VALIDACIÓN DE INSCRIPCIONES
=================================== */

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();

  const partes = fechaNacimiento.split("-");
  const nacimiento = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );

  if (
    !fechaNacimiento ||
    Number.isNaN(nacimiento.getTime()) ||
    nacimiento.getFullYear() !== Number(partes[0]) ||
    nacimiento.getMonth() !== Number(partes[1]) - 1 ||
    nacimiento.getDate() !== Number(partes[2]) ||
    nacimiento > hoy
  ) {
    return -1;
  }

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const cumpleEsteAnio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (
      hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() >= nacimiento.getDate()
    );

  if (!cumpleEsteAnio) {
    edad--;
  }

  return edad;
}

/* ACE CUP - PLAZAS DE DEMOSTRACIÓN */

const MAX_PLAZAS = 32;
let equiposDemo = 0;

const nombresEquiposDemo = [];

const pagosDemo = {};

const equiposEsperaDemo = [];

function actualizarListaEspera() {
  const lista = document.getElementById("lista-espera");
  if (!lista) return;

  lista.replaceChildren();

  if (equiposEsperaDemo.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "lista-vacia";
    vacio.textContent = "No hay equipos en lista de espera.";
    lista.appendChild(vacio);
    return;
  }

  equiposEsperaDemo.forEach(function(nombre, indice) {
    const equipo = document.createElement("div");
    equipo.className = "equipo-demo-item";

    const nombreElemento = document.createElement("span");
    nombreElemento.className = "equipo-demo-nombre";
    nombreElemento.textContent = nombre;

    const posicion = document.createElement("span");
    posicion.className = "equipo-demo-numero";
    posicion.textContent = "ESPERA #" + (indice + 1);

    equipo.append(nombreElemento, posicion);
    lista.appendChild(equipo);
  });
}

actualizarListaEspera();

function actualizarListaEquipos() {
  const lista = document.getElementById(
    "lista-equipos-inscritos"
  );

  if (!lista) return;

  lista.replaceChildren();

  if (nombresEquiposDemo.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "lista-vacia";
    vacio.textContent = "Todavía no hay equipos inscritos.";
    lista.appendChild(vacio);
    return;
  }

  nombresEquiposDemo.forEach(function(nombre, indice) {
    const equipo = document.createElement("div");
    equipo.className = "equipo-demo-item";

    const nombreEquipo = document.createElement("span");
    nombreEquipo.className = "equipo-demo-nombre";
    nombreEquipo.textContent = nombre;

    const numeroEquipo = document.createElement("span");
    numeroEquipo.className = "equipo-demo-numero";
    numeroEquipo.textContent = "#" + (indice + 1);

    equipo.appendChild(nombreEquipo);
    equipo.appendChild(numeroEquipo);
    lista.appendChild(equipo);
  });
}

actualizarListaEquipos();

/* ACE CUP - CONTAR EQUIPOS CON PAGO CONFIRMADO */

function contarEquiposConfirmados() {
  return nombresEquiposDemo.filter(function(nombre) {
    return pagosDemo[nombre] === "confirmado";
  }).length;
}

function actualizarContadorPlazas() {
  
const confirmados = contarEquiposConfirmados();

document.getElementById("equipos-inscritos").textContent =
  confirmados;

document.getElementById("plazas-libres").textContent =
  MAX_PLAZAS - confirmados;


  document.getElementById("progreso-plazas").style.width =
    (confirmados / MAX_PLAZAS) * 100 + "%";

  document.getElementById("texto-plazas").textContent =
    equiposDemo + " de " + MAX_PLAZAS +
    " plazas ocupadas";
}

actualizarContadorPlazas();

const formularioAce = document.getElementById(
  "formulario-inscripcion"
);

const mensajeInscripcion = document.getElementById(
  "mensaje-inscripcion"
);

function mostrarMensajeInscripcion(texto, tipo) {
  mensajeInscripcion.textContent = texto;
  mensajeInscripcion.className =
    "mensaje-inscripcion " + tipo;
  mensajeInscripcion.hidden = false;
}

if (formularioAce && mensajeInscripcion) {

  formularioAce.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      mensajeInscripcion.hidden = true;

      const fechaResponsable = document.getElementById(
        "fecha-responsable"
      ).value;

      const edadResponsable = calcularEdad(
        fechaResponsable
      );

      if (edadResponsable < 18) {
        mostrarMensajeInscripcion(
          "El responsable debe tener al menos 18 años y su fecha de nacimiento debe ser válida.",
          "error"
        );
        return;
      }

      for (let i = 1; i <= 6; i++) {

        const fechaJugador = document.getElementById(
          "fecha-jugador-" + i
        ).value;

        const edadJugador = calcularEdad(
          fechaJugador
        );

        if (edadJugador < 16) {
          mostrarMensajeInscripcion(
            "El jugador " + i +
            " debe tener al menos 16 años y una fecha de nacimiento válida.",
            "error"
          );
          return;
        }
      }

      

if (equiposDemo >= MAX_PLAZAS) {

  const nombreEspera = document.getElementById(
    "nombre-equipo"
  ).value.trim();

  const nombreNormalizado = nombreEspera.toLowerCase();

  const yaExiste =
    nombresEquiposDemo.some(
      nombre => nombre.toLowerCase() === nombreNormalizado
    ) ||
    equiposEsperaDemo.some(
      nombre => nombre.toLowerCase() === nombreNormalizado
    );

  if (yaExiste) {
    mostrarMensajeInscripcion(
      "Este equipo ya está registrado en la demostración.",
      "error"
    );
    return;
  }

  equiposEsperaDemo.push(nombreEspera);
  actualizarListaEspera();
  actualizarPanelAdmin();
  mostrarMensajeInscripcion(
    "Las 32 plazas están ocupadas. " +
    "Tu equipo ha entrado en la lista de espera simulada.",
    "exito"
  );

  return;
}



const nombreEquipo = document.getElementById(
  "nombre-equipo"
).value.trim();

if (
  nombresEquiposDemo.some(
    nombre => nombre.toLowerCase() === nombreEquipo.toLowerCase()
  )
) {
  mostrarMensajeInscripcion(
    "Ya existe un equipo con ese nombre en la demostración.",
    "error"
  );
  return;
}

nombresEquiposDemo.push(nombreEquipo);

equiposDemo = nombresEquiposDemo.length;

actualizarContadorPlazas();
actualizarListaEquipos();


mostrarMensajeInscripcion(
  "¡Solicitud de demostración completada! " +
  "Los datos del equipo son correctos. " +
  "Has seleccionado el método de pago: " +
  (
    document.getElementById("metodo-pago").value === "online"
      ? "Pago online simulado."
      : "Transferencia bancaria simulada."
  ) +
  " No se ha realizado ningún pago real " +
  "ni se ha enviado información.",
  "exito"
);


    }
  );

}

/* ACE CUP - REINICIAR DEMOSTRACIÓN */

const botonReiniciar = document.getElementById(
  "reiniciar-demo"
);

if (botonReiniciar) {
  botonReiniciar.addEventListener("click", function() {

  
nombresEquiposDemo.length = 0;
equiposDemo = 0;

Object.keys(pagosDemo).forEach(function(nombre) {
  delete pagosDemo[nombre];
});

equiposEsperaDemo.length = 0;
actualizarListaEspera();

actualizarContadorPlazas();
actualizarListaEquipos();
actualizarPanelAdmin();

if (formularioAce) {
  formularioAce.reset();
}

if (mensajeInscripcion) {
  mensajeInscripcion.hidden = true;
}

});
}

/* ===================================
   ACE CUP - ADMIN DASHBOARD DEMO
=================================== */

function actualizarPanelAdmin() {

  const inscritos = document.getElementById(
    "admin-inscritos"
  );

  const libres = document.getElementById(
    "admin-libres"
  );

  const espera = document.getElementById(
    "admin-espera"
  );

  const lista = document.getElementById(
    "admin-lista-equipos"
  );

  if (!inscritos || !libres || !espera || !lista) {
    return;
  }

  inscritos.textContent = nombresEquiposDemo.length;
  libres.textContent =
    MAX_PLAZAS - nombresEquiposDemo.length;
  espera.textContent = equiposEsperaDemo.length;

  lista.replaceChildren();

  if (nombresEquiposDemo.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "lista-vacia";
    vacio.textContent =
      "Todavía no hay equipos inscritos.";
    lista.appendChild(vacio);
    return;
  }

  nombresEquiposDemo.forEach(function(nombre, indice) {

    const fila = document.createElement("div");
    fila.className = "equipo-demo-item";

    const nombreElemento = document.createElement("span");
    nombreElemento.className = "equipo-demo-nombre";
    nombreElemento.textContent = nombre;

    const numero = document.createElement("span");
    numero.className = "equipo-demo-numero";
    numero.textContent = "#" + (indice + 1);

    
/* ESTADO DE PAGO SIMULADO */

const selectorPago = document.createElement("select");
selectorPago.className = "admin-selector-pago";

const opcionPendiente = document.createElement("option");
opcionPendiente.value = "pendiente";
opcionPendiente.textContent = "PAGO PENDIENTE";

const opcionConfirmado = document.createElement("option");
opcionConfirmado.value = "confirmado";
opcionConfirmado.textContent = "PAGO CONFIRMADO";

selectorPago.append(opcionPendiente, opcionConfirmado);

selectorPago.value =
  pagosDemo[nombre] || "pendiente";

selectorPago.addEventListener("change", function() {
  pagosDemo[nombre] = selectorPago.value;
  actualizarPanelAdmin();
});

fila.append(nombreElemento, numero, selectorPago);
lista.appendChild(fila);


  });

}



actualizarPanelAdmin();


/* ACE CUP - PRODUCTOS OFICIALES */

const productosAce = [
  { nombre: "Camiseta oficial", precio: 12, emoji: "👕", tallas: true },
  { nombre: "Sudadera", precio: 20, emoji: "🧥", tallas: true },
  { nombre: "Mochila deportiva", precio: 5, emoji: "🎒", tallas: false },
  { nombre: "Gorra", precio: 10, emoji: "🧢", tallas: false },
  { nombre: "Botella reutilizable", precio: 7, emoji: "🥤", tallas: false },
  { nombre: "Toalla", precio: 10, emoji: "🧺", tallas: false },
  { nombre: "Calcetines", precio: 5, emoji: "🧦", tallas: false },
  { nombre: "Bolsa de tela", precio: 5, emoji: "🛍️", tallas: false },
  { nombre: "Pulsera", precio: 2, emoji: "📿", tallas: false },
  { nombre: "Llavero", precio: 3, emoji: "🔑", tallas: false }
];

function mostrarProductosAce() {
  const contenedor = document.getElementById("tienda-productos");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  productosAce.forEach(function(producto, indice) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tienda-producto";

    const imagen = document.createElement("div");
    imagen.className = "tienda-imagen";
    imagen.textContent = producto.emoji;

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre.toUpperCase();

    const precio = document.createElement("p");
    precio.className = "tienda-prezo";
    precio.textContent = producto.precio.toFixed(2).replace(".", ",") + " €";

    tarjeta.append(imagen, nombre, precio);

    if (producto.tallas) {
      const selector = document.createElement("select");
      selector.id = "talla-producto-" + indice;

      ["S", "M", "L", "XL"].forEach(function(talla) {
        const opcion = document.createElement("option");
        opcion.value = talla;
        opcion.textContent = "Talla " + talla;
        selector.appendChild(opcion);
      });

      tarjeta.appendChild(selector);
    }

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "AÑADIR AL CARRITO";
    boton.dataset.producto = indice;

    tarjeta.appendChild(boton);
    contenedor.appendChild(tarjeta);
  });
}

mostrarProductosAce();

/* ACE CUP - CARRITO DE COMPRA */

const carritoAce = [];

function actualizarCarritoAce() {
  const lista = document.getElementById("carrito-lista");
  const totalElemento = document.getElementById("carrito-total");

  if (!lista || !totalElemento) return;

  lista.innerHTML = "";
  let total = 0;

  if (carritoAce.length === 0) {
    lista.textContent = "Tu carrito está vacío.";
  }

  carritoAce.forEach(function(producto, indice) {
    total += producto.precio;

    const fila = document.createElement("div");
    fila.className = "carrito-item";

    const descripcion = document.createElement("span");
    descripcion.textContent =
      producto.nombre +
      (producto.talla ? " · Talla " + producto.talla : "") +
      " — " + producto.precio.toFixed(2).replace(".", ",") + " €";

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.textContent = "ELIMINAR";

    eliminar.addEventListener("click", function() {
      carritoAce.splice(indice, 1);
      actualizarCarritoAce();
    });

    fila.append(descripcion, eliminar);
    lista.appendChild(fila);
  });

  totalElemento.textContent =
    total.toFixed(2).replace(".", ",") + " €";
}

/* BOTONES PARA AÑADIR PRODUCTOS */

const contenedorTienda = document.getElementById("tienda-productos");

if (contenedorTienda) {
  contenedorTienda.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button[data-producto]");

    if (!boton || !contenedorTienda.contains(boton)) return;

    const indice = Number(boton.dataset.producto);
    const producto = productosAce[indice];

    if (!producto) return;

    let talla = "";

    if (producto.tallas) {
      const selector = document.getElementById("talla-producto-" + indice);
      talla = selector.value;
    }

    carritoAce.push({
      nombre: producto.nombre,
      precio: producto.precio,
      talla: talla
    });

    actualizarCarritoAce();

    document.getElementById("mensaje-compra").textContent =
      "Producto añadido al carrito.";
  });
}

actualizarCarritoAce();

/* ACE CUP - FINALIZAR COMPRA SIMULADA */

const botonFinalizarAce = document.getElementById("boton-comprar");

if (botonFinalizarAce) {
  botonFinalizarAce.addEventListener("click", function() {
    const mensaje = document.getElementById("mensaje-compra");

    if (carritoAce.length === 0) {
      mensaje.textContent = "Añade productos antes de finalizar la compra.";
      return;
    }

    carritoAce.length = 0;
    actualizarCarritoAce();

    mensaje.textContent =
      "¡COMPRA SIMULADA COMPLETADA! Gracias por apoyar ACE CUP.";
  });
}

/* ===================================
   ACE CUP - CLASIFICACIONES
=================================== */

const equiposAce = [
  ["ACE TITANS", "VÓLEY STORM", "LOS IMPARABLES", "NOVA TEAM"],
  ["BLUE SHARKS", "VOLLEY KINGS", "FÉNIX CLUB", "TEAM ROCKET"],
  ["BLACK PANTHERS", "LOS GUERREROS", "ATLANTIC VÓLEY", "SKY TEAM"],
  ["DRAGONES VC", "POWER SIX", "WILD WOLVES", "TITANES"],
  ["THUNDER CLUB", "LOS HALCONES", "GALICIA VÓLEY", "DREAM TEAM"],
  ["IRON SIX", "VÓLEY LEGENDS", "FIREBALL", "OCEAN TEAM"],
  ["ROYAL SPIKE", "LOS VIKINGOS", "NORTH STARS", "ECLIPSE"],
  ["ACE WARRIORS", "SPARTANS VC", "RISING STARS", "PHOENIX SIX"]
];

const letrasGruposAce = "ABCDEFGH";

function mostrarClasificacionesAce() {
  const contenedor = document.getElementById("grupos-ace");

  if (!contenedor) return;

  contenedor.innerHTML = equiposAce.map((equipos, indice) => {
    const filas = equipos.map((equipo, posicion) => `
      <tr>
        <td>${posicion + 1}</td>
        <td>${equipo}</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
      </tr>
    `).join("");

    return `
      <div class="grupo-ace">
        <h3>GRUPO ${letrasGruposAce[indice]}</h3>

        <div class="table-container">
          <table class="standings-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>EQUIPO</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PP</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join("");
}

mostrarClasificacionesAce();

/* ===================================
   ACE CUP - CALENDARIO DE PARTIDOS
=================================== */

function mostrarCalendarioAce() {
  const contenedor = document.getElementById("calendario-ace");
  if (!contenedor) return;

  
const jornadas = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]]
];

const diasJornadas = [1, 2, 2];


  const partidos = [];

  // Tres jornadas: todos contra todos en cada grupo
  jornadas.forEach((cruces, jornada) => {
    equiposAce.forEach((equipos, grupo) => {
      cruces.forEach(([local, visitante]) => {
        partidos.push({
          
dia: diasJornadas[jornada],

          grupo: letrasGruposAce[grupo],
          local: equipos[local],
          visitante: equipos[visitante]
        });
      });
    });
  });

  
  // DÍA 3 - OCTAVOS Y CUARTOS
  const eliminatoriasDia3 = [
    ["OCTAVOS 1", "1.º GRUPO A", "2.º GRUPO B"],
    ["OCTAVOS 2", "1.º GRUPO C", "2.º GRUPO D"],
    ["OCTAVOS 3", "1.º GRUPO E", "2.º GRUPO F"],
    ["OCTAVOS 4", "1.º GRUPO G", "2.º GRUPO H"],
    ["OCTAVOS 5", "1.º GRUPO B", "2.º GRUPO A"],
    ["OCTAVOS 6", "1.º GRUPO D", "2.º GRUPO C"],
    ["OCTAVOS 7", "1.º GRUPO F", "2.º GRUPO E"],
    ["OCTAVOS 8", "1.º GRUPO H", "2.º GRUPO G"],
    ["CUARTOS 1", "GANADOR OCTAVOS 1", "GANADOR OCTAVOS 2"],
    ["CUARTOS 2", "GANADOR OCTAVOS 3", "GANADOR OCTAVOS 4"],
    ["CUARTOS 3", "GANADOR OCTAVOS 5", "GANADOR OCTAVOS 6"],
    ["CUARTOS 4", "GANADOR OCTAVOS 7", "GANADOR OCTAVOS 8"]
  ];

  eliminatoriasDia3.forEach(([fase, local, visitante]) => {
    partidos.push({
      dia: 3,
      grupo: fase,
      local,
      visitante
    });
  });

  // DÍA 4 - SEMIFINALES Y FINALES
  const eliminatoriasDia4 = [
    ["SEMIFINAL 1", "GANADOR CUARTOS 1", "GANADOR CUARTOS 2"],
    ["SEMIFINAL 2", "GANADOR CUARTOS 3", "GANADOR CUARTOS 4"],
    ["TERCER Y CUARTO PUESTO", "PERDEDOR SEMIFINAL 1", "PERDEDOR SEMIFINAL 2"],
    ["GRAN FINAL", "GANADOR SEMIFINAL 1", "GANADOR SEMIFINAL 2"]
  ];

  eliminatoriasDia4.forEach(([fase, local, visitante]) => {
    partidos.push({
      dia: 4,
      grupo: fase,
      local,
      visitante
    });
  });


  contenedor.innerHTML = [1, 2, 3, 4].map(dia => {
    const partidosDia = partidos.filter(p => p.dia === dia);

    return `
      <div class="calendario-dia">
        
<h3>DÍA ${dia} · ${[
  "",
  "FASE DE GRUPOS · JORNADA 1",
  "FASE DE GRUPOS · JORNADAS 2 Y 3",
  "OCTAVOS Y CUARTOS DE FINAL",
  "SEMIFINALES Y FINAL"
][dia]}</h3>


        <div class="calendario-partidos">
          ${partidosDia.map(partido => `
            <div class="calendario-partido">
              <span class="partido-grupo">
                ${dia === 4 ? partido.grupo : "GRUPO " + partido.grupo}
              </span>

              <div class="partido-equipos">
                <span>${partido.local}</span>
                <strong>VS</strong>
                <span>${partido.visitante}</span>
              </div>

              <span class="partido-estado">PENDIENTE</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

mostrarCalendarioAce();



