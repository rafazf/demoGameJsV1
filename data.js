const tablero = document.querySelector('.tablero')
const objeto = document.querySelector('.objeto')
const contenedor = document.querySelector('.item')
const puntaje = document.querySelector('.puntaje')
const botones = document.querySelector('.btonContent')
const containerSeleccion = document.querySelector('.containerSeleccion')

const vX = document.documentElement.clientWidth
const vY = document.documentElement.clientHeight
const i = 30;
var score = 0;

//Guardar datos del juego en localStorage
function saveDataGame(isColor){
    localStorage.setItem('colorContenedor',isColor)
}
//obtener datos del juego del localStorage
function getDataGame(){
    let isColor = localStorage.getItem("colorContenedor") || false
    return isColor
}
//indicar seleccion de boton del color
async function  seleccionColor(e){
    e.preventDefault()
    if(e.target.matches(".bton")){
        const getColor = e.target.getAttribute('data-color')
        e.currentTarget.style.background = getColor     
        await new Promise((resolve)=>{
            setTimeout(resolve,1000)
        })
        saveDataGame(getColor)
        containerSeleccion.remove()
        tablero.classList.remove('hide')
        //Iniciamos el juego
        start()
    }
}
botones.addEventListener('click',seleccionColor)

async function mover(obj) {
    obj.style.left = posicionA()+'px'
    const tiempoInicio = new Date().getTime();
        
    function animar(){
        const tiempoActual = new Date().getTime();
        const tiempoTranscurrido = tiempoActual - tiempoInicio;

        var nuevaPos = (tiempoTranscurrido/1000)*100
        obj.style.top = nuevaPos+'px';
        
        var poxy = posicion(obj)
        var poxyContenedor = posicion(contenedor)
        
        if(!haColisionado(poxy,poxyContenedor)){
            if(afuera(obj)){
                eliminarObjetos(obj)
            }else{
                requestAnimationFrame(animar)
            }
        }else{
            var colorObj = isColor(obj)
            if(colorObj == contenedor.style.backgroundColor){
                asignarPuntaje()
            }
            eliminarObjetos(obj)
        }
    }
    requestAnimationFrame(animar)
}
function asignarPuntaje(){
    score = score + 1;
    console.log(score)
    //puntaje.textContent=score
    puntaje.textContent+='🌟'
}
function eliminarObjetos(obj){
    obj.remove()
}
function haColisionado(objA, objB) {
    return (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
    );
}
//funcion indica si un elemento esta fuera de los limites inferiores de la ventana
function afuera(elemento) {
    return elemento.offsetTop > window.innerHeight ||  elemento.offsetTop +
    elemento.offsetHeight <= 0 ;
}
function posicion(obj){
    var coordenadas = obj.getBoundingClientRect();
    return {
        x: coordenadas.left,
        y: coordenadas.top,
        width: coordenadas.width,
        height: coordenadas.height
    }
}
function posicionA(){
    var wPantalla = window.innerWidth;
    var vAleatorio = Math.random()*wPantalla
    vAleatorio = Math.round(vAleatorio)
    return vAleatorio
}
//Movimiento del contenedor
document.addEventListener('keydown',function(e){
    const divX = contenedor.offsetLeft;
    switch (e.key) {
        case 'ArrowRight':
            const nuevaPosR = divX + i
            contenedor.style.left = nuevaPosR+'px'
            break;
        case 'ArrowLeft':
            const nuevaPosL = divX - i
            contenedor.style.left = nuevaPosL+'px'
        default:
            break;
    }
})
//funcion para crear objeto
function createNewObject(color){
    var newObject = document.createElement('div')
    newObject.classList.add("objeto")
    newObject.style.backgroundColor=color
    return tablero.appendChild(newObject)
}
//funcion que crea una cantidad n de objetos
function createNewObjects(n){
    return new Promise((resolve)=>{
        async function generaObjetos(){
            let count = 1;
            async function creaYmueve(){
                const newObject = createNewObject(getRandomColor())
                mover(newObject)
                await new Promise((resolve)=> setTimeout(resolve, 1000))
            }
            async function bucleObjetos(){
                while(count < n){
                    await creaYmueve();
                    count++;
                }
            }
            await bucleObjetos()
            resolve('limite alcanzado'+n)
        }
        generaObjetos()
    })
}
//funcion para generar colores aleatorios
function getRandomColor() {
    const arrColor = ['gray','brown','green','yellow','blue','red']
    const numeroDecimal = Math.random();
    const numeroAleatorio = Math.floor(numeroDecimal * 6) + 1;
    return arrColor[numeroAleatorio];
}
//funcion identifica color de elemento 
function isColor(obj){
    const color = obj.style.backgroundColor
    return color
}
//funcion para asignar el color del contenedor
function setContainerColor(container, color){
    container.style.backgroundColor = color
}
function start(){
    contenedor.style.backgroundColor = getDataGame  ('colorContenedor')
    var colorContenedor = contenedor.style.backgroundColor

    createNewObjects(10).then((mensaje)=>{console.log(mensaje)})
}


//mover(objeto,100)
// mover(createNewObject('blue'),1000)
// mover(createNewObject('red'),10)