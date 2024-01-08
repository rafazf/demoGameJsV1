const objeto = document.querySelector('.objeto')
const contenedor = document.querySelector('.item')
const puntaje = document.querySelector('.puntaje')
const vX = document.documentElement.clientWidth
const vY = document.documentElement.clientHeight
const i = 30;

async function mover(obj, time) {
    obj.style.left = posicionAle()+'px'
    contenedor.style.left = posicionAle()+'px'
    const tiempoInicio = new Date().getTime();

    function animar(){
        const tiempoActual = new Date().getTime() + time;
        const tiempoTranscurrido = tiempoActual - tiempoInicio;

        var nuevaPos = (tiempoTranscurrido/1000)*100
        obj.style.top = nuevaPos+'px';
        

        var poxy = posicion(obj)
        var poxyContenedor = posicion(contenedor)
        
        if(!haColisionado(poxy,poxyContenedor)){
            requestAnimationFrame(animar)
        }else{
            eliminarObjetos(obj)
            asignarPuntaje()
        }
    }
    requestAnimationFrame(animar)
}
function asignarPuntaje(){
    puntaje.innerHTML+='🌟'
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
function posicion(obj){
    var coordenadas = obj.getBoundingClientRect();
    return {
        x: coordenadas.left,
        y: coordenadas.top,
        width: coordenadas.width,
        height: coordenadas.height
    }
}
function posicionAle(){
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
mover(objeto,100)