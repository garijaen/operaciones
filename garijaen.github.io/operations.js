// Configuración
const LONGITUD_DIVIDENDO = 4;
const LONGITUD_DIVISOR = 2;
const NUMERO_OPERACIONES = 10;
const COLOR_FONDO_OPERACION = "#fffde7";
const COLOR_ACIERTO = "#c8e6c9";
const OPERACIONES_STR = 'operaciones'

let operaciones = [];
let operacionActual = null;


// Elementos del DOM
const listaOperaciones = document.getElementById("listaOperaciones");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const divisorPopup = document.getElementById("divisorPopup");
const dividendoPopup = document.getElementById("dividendoPopup");
const cocienteInput = document.getElementById("cociente");
const residuoInput = document.getElementById("residuo");
const botonValidar = document.getElementById("botonValidar");

// Iniciar la aplicación
window.onload = function () {
    generarOperaciones();
    renderizarOperaciones();
};

// Genera operaciones aleatorias
function generarOperaciones() {

    const operacionesGuardadas = localStorage.getItem(OPERACIONES_STR);

    if (operacionesGuardadas) {
        operaciones = JSON.parse(operacionesGuardadas)
    } else {
        operaciones = [];
        for (let i = 0; i < NUMERO_OPERACIONES; i++) {
            const divisor = generarNumero(LONGITUD_DIVISOR);
            const dividendo = generarNumero(LONGITUD_DIVIDENDO)
            operaciones.push({
                dividendo,
                divisor,
                cociente: Math.floor(dividendo / divisor),
                residuo: dividendo % divisor,
                correcto: false
            });

        }

        localStorage.setItem(OPERACIONES_STR, JSON.stringify(operaciones))
        isValidJson(localStorage.getItem(OPERACIONES_STR))

    }
    
    //guardarJSON()
}

function generarNumero(longitud, min = 0){
    const minVal = Math.max(min, Math.pow(10, longitud - 1))
    const maxVal = Math.pow(10, longitud) - 1
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

// Muestra las operaciones en la lista
function renderizarOperaciones() {
    listaOperaciones.innerHTML = "";
    operaciones.forEach((op, index) => {
        const contenedor = document.createElement("div");
        contenedor.className = "contenedor-operacion";
        contenedor.style.backgroundColor = op.correcto ? COLOR_ACIERTO : COLOR_FONDO_OPERACION;

        const divRepresentation = document.createElement("div");
        divRepresentation.className = "division-representation";
        divRepresentation.innerHTML = `
                    <div class="divisor">${op.divisor}</div>
                    <div class="dividendo-container">${op.dividendo}</div>
                `;

        contenedor.appendChild(divRepresentation);
        contenedor.addEventListener("click", () => abrirPopup(index));
        listaOperaciones.appendChild(contenedor);
    });

}

// Abre el popup para resolver una operación
function abrirPopup(index) {
    operacionActual = index;
    const op = operaciones[index];
    divisorPopup.textContent = op.divisor;
    dividendoPopup.textContent = op.dividendo;
    cocienteInput.value = "";
    residuoInput.value = "";
    popup.style.display = "block";
    overlay.style.display = "block";
    cocienteInput.focus();
}

// Cierra el popup
function cerrarPopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
}

// Valida las respuestas
function validarRespuesta() {
    const op = operaciones[operacionActual];
    const cocienteUsuario = parseInt(cocienteInput.value);
    const residuoUsuario = parseInt(residuoInput.value);

    if (isNaN(cocienteUsuario)) {
        alert("Por favor ingresa el cociente");
        cocienteInput.focus();
        return;
    }
    if (isNaN(residuoUsuario)) {
        alert("Por favor ingresa el residuo");
        residuoInput.focus();
        return;
    }

    if (cocienteUsuario === op.cociente && residuoUsuario === op.residuo) {
        op.correcto = true;
        renderizarOperaciones();
        cerrarPopup();
    } else {
        alert("Incorrecto. ¡Intenta de nuevo!");
    }
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        alert(("No se ha podido generar el json"))
        return false;
    }
}

function guardarJSON(){

    if(localStorage.getItem(OPERACIONES_STR) != undefined && isValidJson(localStorage.getItem(OPERACIONES_STR))){
        localStorage.clear()
        localStorage.setItem(OPERACIONES_STR, JSON.stringify(operaciones))
        generarArchivoJSON()
    }
}

function generarArchivoJSON(){

    const datos = JSON.stringify(operaciones, null, 2)

    //crear descargable
    const blob = new Blob([datos], {type: 'application/json'})
    const url =  URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'operaciones.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url) 
}

function reiniciarOperaciones(){
    localStorage.clear()
    window.onload()
}


// Event listeners
botonValidar.addEventListener("click", validarRespuesta);
overlay.addEventListener("click", cerrarPopup);