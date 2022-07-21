// Patrón módulo
const MiJuego = (() => {
    'use strict'
    // Variables generales
    const tipos = ['C','D','H','S'],
        especiales = ['A','J','Q','K'];

    let deck = [],
        puntosJugadores = [];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');


    const puntosHTML = document.querySelectorAll('small'),
          divCartasJugadores = document.querySelectorAll('.divCartas');

    // Funciones 
    const crearDeck = () => {
        deck = [];
        for (let i=2; i<11; i++){
            for (let tipo of tipos){
                deck.push( i + tipo );
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push( especial + tipo );
            }
        }
        deck = _.shuffle( deck );
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el Deck';
        }
        const carta = deck.pop();
        return carta;
    }

    const inicializarJuego = ( numJugadores =2 ) => {
        crearDeck();
        puntosJugadores = [];
        for (let i=0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0  );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length -1);
        return ( isNaN(valor) ) ? ( ( valor === 'A' ) ? 11 : 10 ) : valor * 1 ;
    }

    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const determinarGanador = () => {
        const [puntajeMinimo, puntosComputador] = puntosJugadores;

        setTimeout( () => {
            const mensaje = ( puntajeMinimo === puntosComputador ) ? 'Nadie gana' :
                            ( puntajeMinimo > 21 ) ? 'Computador gana' :
                            ( puntosComputador > 21 ) ? 'Jugador gana' : 'Computadora gana' ;
            
            alert( mensaje );
        }, 10 );
    }

    const crearCarta = ( carta, turno ) => {
        const imagenCarta = document.createElement('img'); 
        imagenCarta.src = `./assets/cartas/${carta}.png`;
        imagenCarta.classList.add( 'carta' );
        divCartasJugadores[turno].append( imagenCarta );
    }

    const turnoComputadora = ( puntajeMinimo ) => {
        let puntosComputador = 0;
        do {
            const miCarta = pedirCarta();
            puntosComputador = acumularPuntos( miCarta, 1 );
            crearCarta(miCarta, puntosJugadores.length - 1);

        } while ( (puntosComputador < puntajeMinimo) && ( puntajeMinimo <=21 ) )
        
        determinarGanador();
    }


    // Eventos
    // Function en el evento se llama Callback
    btnPedir.addEventListener('click', () => {
        const miCarta = pedirCarta();
        const puntosJugador = acumularPuntos( miCarta, 0 );
        crearCarta(miCarta, 0);
        
        if ( puntosJugador > 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        } else if ( puntosJugador === 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        }
    })

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    })

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    })
    return {
        nuevoJuego: inicializarJuego
    }

})();

// Se puede consultar el objeto DOM mediate el document
// querySelector, querySelectorAll por id #, por clase .
// getElementByClassName, getElementById

// Se recomienda el querySelector

// Otra manera, menos eficiente:
// const carta = _.sample( deck );
// const posicion = deck.indexOf(carta);
// deck.splice(posicion,1);
