// elementos para la fecha
const diaNumero = document.getElementById("diaNumero");
const diaText = document.getElementById("diaLetra");
const mesElement = document.getElementById("mes");
const anhoElement = document.getElementById("anho");
let tarea =[];
let tareas =[];
// contenedor de tareas 
const contenedorDeTareas = document.getElementById("contenedorDeTareas");
//localStorage.setItem('tareas', JSON.stringify(tarea));

DatoStorage();
//obtener datos del localstorage
function DatoStorage() {
  document.addEventListener('DOMContentLoaded', () =>{
    tareas = JSON.parse(localStorage.getItem('tareas'));
    if (!Array.isArray(tareas)) {
      localStorage.setItem('tareas', JSON.stringify(tarea));
      tareas = JSON.parse(localStorage.getItem('tareas'));
    }else{
      tarea=[];
      //console.log(tarea);
      tareas.forEach(i=>{
        tarea.push(i);
      })
      crearHtml();
    }
  })
}


const setDate = () =>{
  const date = new Date();
  //textContent funciona de manera similar a innerHtml
  //toLocaleString se utiliza para darle formatos a la fecha, este caso le indicamos el idioma de la feche que sera español y que nos devuelva la fecha del dia en numero
  diaNumero.textContent = date.toLocaleString('es', { day: 'numeric' });
  diaText.textContent = date.toLocaleString('es', { weekday: 'long' });
  mesElement.textContent = date.toLocaleString('es', { month: 'short' });
  anhoElement.textContent = date.toLocaleString('es', { year: 'numeric' });
  //console.log(mesElement);
  //console.log(anhoElement);
};

const agregarNuevaTarea = event =>{
  //con esta funcion eliminamos lo que se imprimio antes para que la lista no se vaya repitiendo
  limpiarHtml();
  //esto evita que el formulario se envie con metodo post o get y solo realice la accion de esta funcion 
  event.preventDefault();
  //obtenemos el valor del campo de texto
  const {value} = event.target.textoTarea;
  //no se realiza nada si es que el campo esta vacio o solo esta relleno de espacios
  if(!value || (/^\s+$/.test(value))) return
  //creamos un objeto para poder ir guardando las tareas como un array en el localstorage
  const almacenarObj ={
    tarea: value,
    id:Date.now(),
    listo: false
  };
  //copiamos la lista que ya teniamos y le agregamos el nuevo elemento
  tarea.push(almacenarObj);
  crearHtml();
  event.target.reset();
};

function crearHtml() {
  if (tarea.length>0) {
    tarea.forEach(task =>{
      const tareaElement = document.createElement('div');
      tareaElement.id=task.id;
      //agregamos una lista de clases a elemento tarea
      const parrafo = document.createElement('span');
      //con esto controlo si la tarea ya esta marcada y le agrego la clase hecha que lo tacha
      if (task.listo==true) {
        tareaElement.classList.add('tarea', 'bordeRedondo', "hecho");
      }
      tareaElement.classList.add('tarea', 'bordeRedondo');
      
      //le damos un avento click al div tarea para poder cambiar el estado de las tareas terminadas
      tareaElement.addEventListener('click',cambiarEstadoDeTarea);

      //creamos un boto para poder eliminar alguna tarea que ya este hecha o que lo hayamos puesto por equivocacion
      const botonEliminar = document.createElement('button');
      botonEliminar.innerText='x';
      botonEliminar.classList.add('eliminarTarea');
      //agregamos fucion que se realizara al hacer click en el boton 
      botonEliminar.addEventListener('click',eliminarTarea);
      parrafo.textContent=task.tarea;
      //agregamos el texto al elemento para mostrar
      tareaElement.prepend(parrafo);
      //agregamos el boton al elemento
      tareaElement.prepend(botonEliminar);

      //con prepend hacemos que cada tarea que se insete quede al principio de la lista
      contenedorDeTareas.prepend(tareaElement);
    });
    guardarStorage();

  }
}
//vamos limpiando lo que se imprimio anteriormente para que no se repitan las tareas 
function limpiarHtml() {
  contenedorDeTareas.innerHTML='';
}

//guardamos las tareas al local storage
function guardarStorage() {
  localStorage.setItem('tareas', JSON.stringify(tarea));
}

function dataForJson() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
  const dataLocal = JSON.parse(localStorage.getItem('tareas'));
  console.log(dataLocal);
}

const cambiarEstadoDeTarea = event =>{
  //cambiamos el estilo de las tareas cuando se realizan 
  //toggle es utilizado para cambiar o alternar estilos
  event.target.classList.toggle("hecho");
  const id =event.target.id;
  const data = JSON.parse(localStorage.getItem('tareas'));
  //agregamos un elemento mas para controlar y mantener ciertos estilos 
  if (data.length > 0) {
    data.forEach(d =>{
      if (id == d.id) {
        if (d.listo === false) {
          d.listo=true;
          localStorage.setItem('tareas', JSON.stringify(data));
        }else{
          d.listo=false;
          localStorage.setItem('tareas', JSON.stringify(data));
        }
        
      }
    });
  }
}

const eliminarTarea = event =>{
  const item = event.target.parentElement;
  const id =event.target.parentElement.id;
  const datos = JSON.parse(localStorage.getItem('tareas'));
  if (datos.length > 0) {
    for (let i = 0; i < datos.length; i++){
      if (id == datos[i].id) {
        datos.splice(i,1);
        localStorage.setItem('tareas', JSON.stringify(datos));
      }
    }
  }
  contenedorDeTareas.removeChild(item);

}

const ordenar = () => {
  const hecho = [];
  const queHacer = [];
  //recorremos todos los elementos hijo del contenedor con el foreach y retornamos una lista
  contenedorDeTareas.childNodes.forEach(el => {
    //estamos preguntando si el elmento tine la clase hecho para saber a que lista agregar el elemento
    el.classList.contains('hecho') ? hecho.push(el) : queHacer.push(el);
  })
  //retornamos la lista con los queHaceres arriba de las tareas realizadas
  return [...queHacer, ...hecho];
}

const recargarTareasOrdenadas = () => {
  //recorremos la lista y vamos agregando las tareas del mas reciente al mas antiguo y despues las que ya estan hechas 
  ordenar().forEach(ele => contenedorDeTareas.appendChild(ele));
}
//llamamos a la funcion para que se pueda setear la fecha
setDate();
