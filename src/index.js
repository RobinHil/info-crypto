import { App } from './scripts/app.js' /** Importe la classe App qui gère la mise en place complète de l'applications. */
import './stylesheets/styles.scss' /** Importe le css principal. */
import 'bootstrap' /** Importe bootstrap afin d'avoir un affichage plus esthétique. */

/** Crée une instance de la classe App = mise en place de l'application */
function start()
{
    let app = new App()
}

/**
 * La gestion en js de l'application ne démarre que lorsque l'entièreté de la page est chargée.
 * Cela permet d'éviter d'éventuelles erreurs dues au chargement du html/scss de base.
 */
window.addEventListener('load', start)