/*

1) Haciendo uso de funciones y new, realiza una "clase" Vikingo que almacene la información de un vikingo:

nombre
salud (0 - 1000)
potenciaAtaque (1 - 20)
valocidad (0 - 100)

2) Haz uso de prototype y añade un método .ataca(vikingo) a un vikingo para que ataque a su oponente.
el ataque quitara salud al vikingo atacado (la potencia de ataque del atacante)

3) Realiza una clase Batalla() cuyas instancias enfrenten a dos vikingos.

Batalla tendrá un método iniciarPelea que hará de comienzo.

Una batalla tendrá una serie de asaltos en los que:

atacará primero el que más valocidad tenga,
y queitará de saludo su potencia de ataque al rival,
hasta que uno muera.

4) Crear la clase Arma() tenga un tipo: (espada/cuchillo...etc), una potencia (20 - 50) y un ataquesRestantes (0 -10).

5) Añade una propiedad armas a Vikingo para que pueda poseer varias armaspara su batalla.
Añade el método addArma() para añadir armas a los vikingos,

6) Modifica la función ataca del vikingo, para que si tiene armas disponibles ataque con el arma más potente.
Cada vez que se use un arma, debera restar uno a ataquesRestantes de ese arma.
Cuando el arma tenga 0 ataquesRestantes, el vikingo deberá abandonar el arma (añade la función abandonarArma al vikingo).

 */


// saludMaxima se usa como constante donde queramos usar la salud máxima (la bajé a 500 para que la batalla dure menos)
var saludMaxima = 500;
var nombresPersonas = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Raymundo", "Fran"];
var armas = [];

/* ********** Clase Vikingo ********** */
function Vikingo() {
    this.nombre = "";
    this.salud = 100;
}

Vikingo.prototype.initVikingo =  function(){
    this.nombre = generarNombreAleatorio();
}

function generarNombreAleatorio(){
    var numeroAleatorio = Math.floor(Math.random() * nombresPersonas.length);
    return nombresPersonas[numeroAleatorio];
}

/* ********** Clase Batalla ********** */
function Batalla(ejercito1, ejercito2) {
    //this.vikingos = [vikingo1, vikingo2];
    this.ejercito1 = ejercito1;
    this.ejercito2 = ejercito2;
}
Batalla.prototype.enfrentarEjercitos = function(){
    while(this.ejercito1.soldados.length>0 && this.ejercito2.soldados.length>0){
        var soldado1 = this.ejercito1.soldados[0];
        var soldado2 = this.ejercito2.soldados[0];
        var pelea = new Pelea(soldado1, soldado2);
        pelea.iniciarPelea();

        // ver si alguno ha muerto....
        console.log("Soldado-> ",soldado1);
        if(soldado1.salud == 0){
            console.log("Se murio-> " + soldado1.nombre);
        }

        if(soldado2.salud == 0){
            console.log("Se murio-> " + soldado2.nombre);
        }
    }

}

function Pelea(vikingo1, vikingo2) {
    this.vikingo1 = vikingo1;
    this.vikingo2 = vikingo2;
}

Pelea.prototype.iniciarPelea = function() {
    var vikingos = [this.vikingo1, this.vikingo2];
    console.log("***** " + vikingos[0].nombre + " y " + vikingos[1].nombre + " entraran en batalla *****");
    console.log(vikingos[0].getEstado());
    console.log(vikingos[1].getEstado());

    var v1 = vikingos[0].velocidad;
    var v2 = vikingos[1].velocidad;
    var turno = v1 > v2 ? 0 : v1 < v2 ? 1 : Math.round(Math.random());

    var atacante;
    var atacado;

    while (vikingos[0].salud > 0 && vikingos[1].salud > 0) {
        atacante = vikingos[turno];
        atacado = vikingos[turno ? 0 : 1];
        atacante.ataca(atacado);
        turno = turno ? 0 : 1;
    }

    console.log("***** " + atacante.nombre + " ha ganado la batalla contra " + atacado.nombre + " *****");
    atacante.robarDinero(atacado);
    atacante.robarArmas(atacado);
    console.log(vikingos[0].getEstado());
    console.log(vikingos[1].getEstado());
};


/* ********** Clase Arma ********** */
function Arma(tipo, potencia, ataquesRestantes) {
    this.tipo = tipo;
    this.potencia = potencia;
    this.ataquesRestantes = ataquesRestantes;
}
Arma.prototype.usar = function() {
    this.ataquesRestantes--;
};

/* ********** Clase ejercito ********** */
var Ejercito = function(nombre){
    this.nombre = nombre;
    this.soldados = [];
    this.curanderos = [];
}
Ejercito.prototype.reclutarVikingo =  function(vikingo, rol){
    if(rol==="soldado"){
        this.soldados.push(vikingo);
    } else {
        this.curanderos.push(vikingo);
    }
};


/* ********** Clase SoldadoVikingo ********** */
var SoldadoVikingo = function(potencia, velocidad){
    this.initVikingo();
    this.potenciaAtaque = potencia;
    this.velocidad = velocidad;
    this.armas = [];
    this.dinero = Math.floor(Math.random() * 1000) + 200;
    this.armaElegida = null;
}
SoldadoVikingo.prototype = new Vikingo();
SoldadoVikingo.prototype.ataca = function(vikingo) {
    var armaElegida = this.armaElegida || this.elegirArma();
    var potenciaAtaque = this.getPotenciaActual();
    var nombreArma = "sus puños";
        if (armaElegida) {
            armaElegida.usar();
            potenciaAtaque = armaElegida.potencia;
            nombreArma = armaElegida.tipo + "(" + armaElegida.ataquesRestantes + ")";
        }
        console.log(this.nombre + " atacará a " + vikingo.nombre + " con potencia " + potenciaAtaque + " usando " + nombreArma);
        vikingo.modificarSalud(-potenciaAtaque);
        if (armaElegida && armaElegida.ataquesRestantes === 0) {
            this.abandonarArma(armaElegida);
        }
};
SoldadoVikingo.prototype.getPotenciaActual = function() {
    var potenciaActual = Math.round(this.potenciaAtaque * 0.8 + this.potenciaAtaque * 0.2 * this.salud / saludMaxima);
    return potenciaActual;
};
SoldadoVikingo.prototype.modificarSalud = function(cantidad) {
    this.salud += cantidad;
    if (this.salud < 0) {
        this.salud = 0;
    } else {
        if (this.salud > saludMaxima) {
            this.salud = saludMaxima;
        }
    }
    console.log("    La salud de " + this.nombre + " ahora es " + this.salud);
};
SoldadoVikingo.prototype.getEstado = function() {
    var estado = this.nombre + " [salud:" + this.salud + ", potencia:" + this.potenciaAtaque + "(" + this.getPotenciaActual() + "), velocidad:" + this.velocidad + ", dinero:" + this.dinero + "]";
    for (var i = 0; i < this.armas.length; i++) {
        var arma = this.armas[i];
        estado += "\n    " + arma.tipo + " [potencia:" + arma.potencia + ", ataquesRestantes:" + arma.ataquesRestantes + "]";
    }
    return estado;
};
SoldadoVikingo.prototype.addArma = function(arma) {
    this.armas.push(arma);
};
SoldadoVikingo.prototype.abandonarArma = function(arma) {
    var indice = this.armas.indexOf(arma);
    var abandonadas = this.armas.splice(indice, 1);
    if (abandonadas[0] == this.armaElegida) {
        this.armaElegida = null;
    }
    console.log("    " + this.nombre + " ha abandonado su " + abandonadas[0].tipo);
};
SoldadoVikingo.prototype.elegirArma = function() {
    var armaElegida = null;
    for (var i = 0; i < this.armas.length; i++) {
        var arma = this.armas[i];
        if (!armaElegida || arma.potencia > armaElegida.potencia) {
            armaElegida = arma;
        }
    }
    if (armaElegida) {
        console.log("    " + this.nombre + " ha elegido su " + armaElegida.tipo);
        this.armaElegida = armaElegida;
    }
    return armaElegida;
};
SoldadoVikingo.prototype.robarDinero = function(vikingo) {
    this.dinero += vikingo.dinero;
    console.log(this.nombre + " ha robado " + vikingo.dinero + " monedas a " + vikingo.nombre);
    vikingo.dinero = 0;
};
SoldadoVikingo.prototype.robarArmas = function(vikingo) {
    if (vikingo.armas.length) {
        this.armas = this.armas.concat(vikingo.armas);
        console.log(this.nombre + " ha robado " + vikingo.armas.length + " armas a " + vikingo.nombre);
        vikingo.armas = [];
    }
};


//para ejercito 1
var soldado1 = new SoldadoVikingo(15, 22);
var soldado2 = new SoldadoVikingo(20, 24);
var soldado3 = new SoldadoVikingo(25, 26);

//para ejercito2
var soldado4 = new SoldadoVikingo(15, 28);
var soldado5 = new SoldadoVikingo(20, 26);
var soldado6 = new SoldadoVikingo(25, 24);

/* ********** Clase CuranderoVikingo ********** */
var CuranderoVikingo = function(){
    this.initVikingo();
    this.pocimas = 5;
}
CuranderoVikingo.prototype = new Vikingo();
CuranderoVikingo.prototype.resucitar = function(vikingo){
    vikingo.salud = 100;
    this.pocimas = this.pocimas - 1;
};

//para ejercito 1
var curandero1 = new CuranderoVikingo();
var curandero2 = new CuranderoVikingo();

//para ejercito 2
var curandero3 = new CuranderoVikingo();
var curandero4 = new CuranderoVikingo();

/* ********** Inicia la batalla ********** */
var ejercito1 = new Ejercito("Rudos");
//reclutando soldados
ejercito1.reclutarVikingo(soldado1, "soldado");
ejercito1.reclutarVikingo(soldado2, "soldado");
ejercito1.reclutarVikingo(soldado3, "soldado");

//reclutando curanderos
ejercito1.reclutarVikingo(curandero1, "curandero");
ejercito1.reclutarVikingo(curandero2, "curandero");

var ejercito2 = new Ejercito("Tecnicos");
//reclutando soldados
ejercito2.reclutarVikingo(soldado4, "soldado");
ejercito2.reclutarVikingo(soldado5, "soldado");
ejercito2.reclutarVikingo(soldado6, "soldado");

//reclutando curanderos
ejercito2.reclutarVikingo(curandero3, "curandero");
ejercito2.reclutarVikingo(curandero4, "curandero");

var batalla = new Batalla(ejercito1, ejercito2);
batalla.enfrentarEjercitos();


