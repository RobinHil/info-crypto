const Mustache = require('mustache'); /** Import par un require de la bibliothèque mustache qui permettra de charger des templates html. */

import { CryptoCharts } from './cryptoCharts.js'; /** Import de la classe CryptoCharts qui permettra de créer des graphes de données sur les cryptomonnaies. */
import { Crypto } from './crypto.js'; /** Import de la classe Crypto qui stocke les données des cryptomonnaies. */

import logo from '../img/logo.png'; /** Import sous le nom 'logo' du logo de l'application. */

/**
 * Classe mettant en place l'application web.
 * Cette classe permet de mettre en place l'application web à partir de son constructeur et de ses fonctions / données membres.
 */
export class App
{
    /**
     * Donnée membre de la classe App.
     * Cette donnée est destinée à être une Map() contenant chaque cryptomonnaie (objets de la classe Crypto) associée à sa donnée id en clé.
     */
    #cryptoMap;

    /**
     * Constructeur de la classe App.
     * Il ne reçoit aucun argument.
     */
    constructor()
    {
        /**
         * Initialisation de la donnée membre '#cryptoMap'.
         * Il permet d'initialiser la donnée membre en tant que Map() vide.
         */
        this.#cryptoMap = new Map();

        /**
         * Initialisation du contenu html de la page.
         * Import par un require du template de la page html.
         * Chargement à l'intérieur du body du template de la page avec Mustache.
         */
        let page_template = require('../templates/page.mustache');
        document.querySelector('body').innerHTML += Mustache.render(page_template, {sourceLogo: logo});

        /** Appel de la fonction membre App.setApp. */
        this.setApp();

        /** Appel de la fonction membre App.setSearch. */
        this.setSearch();

        /**
         * Rechargement régulier des données.
         * Permet le rechargement toutes les minutes des données contenues dans la donnée membre '#cryptoMap'.
         */
        setInterval(() => this.reload(), 60000);
    }

    /** Fonction membre setApp() de la classe App qui met en place les éléments de l'application web. */
    setApp()
    {
        /** Récupère les données des 100 cryptomonnaies avec les plus grosses capitalisations. */
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=fr&precision=max')
        .then((response) => {
            if (!response.ok)
                throw new Error(`Erreur HTTP! statut: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            /** Pour chaque cryptomonnaie on récupère ses données. */
            let cards = '';
            data.forEach(cryptoData => {
                /** Si une cryptomonnaie n'est pas dans '#cryptoMap' on peut la créer puis l'ajouter à la map et ajouter dans l'affichage sa carte. */
                if (!this.#cryptoMap.has(cryptoData.id))
                {
                    let crypto = new Crypto(cryptoData);
                    this.#cryptoMap.set(crypto.id, crypto);
                    cards += this.renderCryptoCard(crypto);
                }
            });
            /** Les 100 cartes sont insérées en une fois (un innerHTML += par carte reparsait tout le conteneur à chaque tour). */
            document.querySelector('#all_cards').insertAdjacentHTML('beforeend', cards);
            /** Appel de la fonction membre setModal de la classe App avec en paramètre la liste des boutons 'voir plus' des cartes de cryptomonnaies. */
            this.setModal(document.querySelectorAll('.voir-plus'));
        })
        .catch((error) => {
            /** Un try/catch autour d'une chaîne de promesses n'intercepte rien : il faut un .catch(). */
            if (document.querySelector('#page_show_error'))
                document.querySelector('#page_show_error').textContent = `Erreur: ${error.message} !`;
        });
    }

    /**
     * Fonction membre renderCryptoCard(crypto) de la classe App qui construit le HTML de la carte de la cryptomonnaie passée en paramètre.
     * @param { Crypto } crypto Objet de la classe Crypto.
     */
    renderCryptoCard(crypto)
    {
        /**
         * Création à partir du template card.mustache et des données de Crypto de la carte de la crypto passée en paramètre.
         * Le HTML est renvoyé à l'appelant, qui insère toutes les cartes en une seule opération.
         */
        let card_template = require('../templates/card.mustache');
        return Mustache.render(card_template, {
            cryptoId: crypto.id,
            source: crypto.image,
            cryptoName: crypto.name,
            cryptoSymbol: crypto.symbol
        });
    }

    /**
     * Fonction membre setModal(btnList) de la classe App qui paramètre le modal qui s'ouvre lorsque le bouton voir plus d'une cryptomonnaie est cliqué.
     * @param { [] } btnList Liste de 'button' html.
     */
    setModal(btnList)
    {
        btnList.forEach(btn => {
            /** setModal est rappelée quand de nouvelles cartes apparaissent : on n'écoute qu'une fois par bouton. */
            if (btn.dataset.bound === '1') return;
            btn.dataset.bound = '1';

            btn.addEventListener('click', (event) => {
                /** Récupération dans '#cryptoMap' la cryptomonnaie correspondante au bouton (id du bouton = id de la cryptomonnaie). */
                let crypto = this.#cryptoMap.get(btn.id);

                /** Appel de la fonction fillModalContent membre de la classe App avec en paramètre la cryptomonnaie récupérée précédemment. */
                this.fillModalContent(crypto);

                /** Création d'une instance de la classe CryptoCharts avec en paramètre l'id de la cryptomonnaie récupérée précédemment. */
                new CryptoCharts(crypto.id);
            });
        });

        /** Suppression du contenu du modal affichant les données de la cryptomonnaie lors de sa fermeture (une seule fois). */
        let mainModal = document.querySelector('#main_modal');
        if (mainModal.dataset.bound !== '1')
        {
            mainModal.dataset.bound = '1';
            mainModal.addEventListener('hide.bs.modal', (event) => {
                /** Le contenu est absent si l'ouverture a échoué : sans ce garde, .remove() lèverait une TypeError. */
                document.querySelector('#modal_content')?.remove();
            });
        }
    }

    /**
     * Fonction fillModalContent(crypto) membre de la classe App qui remplit le contenu du modal avec les innformation du paramètre crypto.
     * @param { Crypto } crypto Objet de la classe Crypto.
     */
    fillModalContent(crypto)
    {
        if (crypto=='')
        {
            let modal_template = require('../templates/crypto-modal.mustache');
            document.querySelector('#crypto_modal').innerHTML += Mustache.render(modal_template, {
                cryptoName: '',
                cryptoSymbol: '',
                cryptoPrice: '',
                cryptoRank: '',
                cryptoCap: '',
                highPrice: '',
                lowPrice: '',
                priceEvo: '',
                priceEvoP: '',
                capEvo: '',
                capEvoP: '',
                cryptoCircSupply: '',
                cryptoSupply: '',
                cryptoMaxSupply: ''
            });
        }
        else
        {
            /** Création à partir du template crypto-modal.mustache du contenu du modal affichant les détails des cryptomonnaies.
             * Le template est remplit à partir des données contenues dans le paramètre crypto de classe Crypto.
             */
            let modal_template = require('../templates/crypto-modal.mustache');
            document.querySelector('#crypto_modal').innerHTML += Mustache.render(modal_template, {
                cryptoName: crypto.name,
                cryptoSymbol: crypto.symbol,
                cryptoPrice: crypto.current_price,
                cryptoRank: crypto.market_cap_rank,
                cryptoCap: crypto.market_cap,
                highPrice: crypto.high_24h,
                lowPrice: crypto.low_24h,
                priceEvo: (crypto.price_change_24h>0?'+'+crypto.price_change_24h:crypto.price_change_24h),
                priceEvoP: (crypto.price_change_percentage_24h>0?'+'+crypto.price_change_percentage_24h:crypto.price_change_percentage_24h),
                capEvo: (crypto.market_cap_change_24h>0?'+'+crypto.market_cap_change_24h:crypto.market_cap_change_24h),
                capEvoP: (crypto.market_cap_change_percentage_24h>0?'+'+crypto.market_cap_change_percentage_24h:crypto.market_cap_change_percentage_24h),
                cryptoCircSupply: crypto.circulating_supply,
                cryptoSupply: (crypto.total_supply?crypto.total_supply:"indéfinie."),
                cryptoMaxSupply: (crypto.max_supply?crypto.max_supply:"indéfinie.")
            });
            
            /** Les couleurs de certaines balises du contenu du modal sont changées en fonction du contenu de celles-ci. */
            document.querySelector('#price_evo').style.color = (crypto.price_change_24h>0?"darkgreen":"crimson");
            document.querySelector('#cap_evo').style.color = (crypto.market_cap_change_24h>0?"darkgreen":"crimson");
            if (crypto.market_cap_rank == 3)
                document.querySelector('#crypto_rank').style.color = '#614e1a';
            else if (crypto.market_cap_rank == 2)
                document.querySelector('#crypto_rank').style.color = 'silver';
            else if (crypto.market_cap_rank == 1)
                document.querySelector('#crypto_rank').style.color = 'gold';
            else
                document.querySelector('#crypto_rank').style.color = 'black';
        }
    }

    /** Fonction setSearch() membre de la classe App qui gère la recherche de cryptomonnaies. */
    setSearch()
    {
        /** Création à partir du template search-modal.mustache du contenu du modal affichant les résultats de recherche. */
        let search_modal_template = require('../templates/search-modal.mustache');
        document.querySelector('#modal').innerHTML += Mustache.render(search_modal_template);

        /** Actions à réaliser lorsqu'on clique sur le bouton de recherche. */
        document.querySelector('#search_btn').addEventListener('click', (event) => {
            document.querySelector('#search_modal_title').textContent = 'Recherche : \''+document.querySelector('#search_input').value+'\'';
            /** Appel à la fonction de recherche uniquement si le contenu de la recherche est non nul. */
            if (document.querySelector('#search_input').value!=='')
                this.search(document.querySelector('#search_input').value);
        });
        /** Suppression des entrées du tableau contenant les résultats de la recherche à la fermeture du modal. */
        document.querySelector('#search_modal').addEventListener('hide.bs.modal', (event) => {
            document.querySelector('#search_modal tbody')?.remove();
        });
    }
    
    /**
     * Fonction search(searchStr) membre de la classe App.
     * Permet d'effectuer la recherche à partir de la chaîne de caractères en paramètre puis ajoute les entrées au tableau des résultats de recherche.
     * @param { String } searchStr Chaîne de caractères contenant la recherche à effectuer.
     */
    search(searchStr)
    {
        /** La recherche est encodée : sans cela un '&' ou un '#' casserait la query string. */
        fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchStr)}`)
        .then((response) => {
            if (!response.ok)
                throw new Error(`Erreur HTTP! statut: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            document.querySelector('#search_show_error').textContent = '';

            /** Le tableau est construit en une seule passe puis inséré (au lieu d'un innerHTML += par ligne). */
            let search_table_template = require('../templates/search-table.mustache');
            let rows = '';
            data.coins.forEach(cryptoData => {
                rows += Mustache.render(search_table_template, {
                    cryptoRank: (cryptoData.market_cap_rank?cryptoData.market_cap_rank:'Indéfini'),
                    cryptoId: cryptoData.id,
                    cryptoName: cryptoData.name,
                    cryptoSymbol: cryptoData.symbol,
                    sourceImg: cryptoData.thumb
                });
            });
            let tbody = document.createElement('tbody');
            tbody.innerHTML = rows;
            document.querySelector('#search_modal table').appendChild(tbody);

            /**
             * Les écouteurs sont posés ICI, une fois les lignes réellement insérées.
             * Auparavant ils étaient posés juste après l'appel à fetch, donc sur un
             * tableau encore vide : les boutons 'Voir plus' de la recherche ne réagissaient jamais.
             */
            this.bindSearchResultButtons(tbody);
        })
        .catch((error) => {
            /** Un try/catch autour d'une chaîne de promesses n'intercepte rien : il faut un .catch(). */
            if (document.querySelector('#search_show_error'))
                document.querySelector('#search_show_error').textContent = `Erreur: ${error.message} !`;
        });
    }

    /**
     * Fonction bindSearchResultButtons(tbody) membre de la classe App.
     * Branche l'ouverture du détail sur chaque bouton 'Voir plus' du tableau de résultats.
     * @param { HTMLElement } tbody Le corps de tableau contenant les résultats de la recherche.
     */
    bindSearchResultButtons(tbody)
    {
        tbody.querySelectorAll('.search-voir-plus').forEach(btn => {
            btn.addEventListener('click', (event) => {
                fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(btn.id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
                .then((response) => {
                    if (!response.ok)
                        throw new Error(`Erreur HTTP! statut: ${response.status}`);
                    return response.json();
                })
                .then((data) => {
                    let crypto = new Crypto(data);
                    this.fillModalContent(crypto);
                    new CryptoCharts(crypto.id);
                })
                .catch((error) => {
                    this.fillModalContent('');
                    if (document.querySelector('#modal_show_error'))
                        document.querySelector('#modal_show_error').textContent = `Erreur: ${error.message} !`;
                });
            });
        });
    }

    /**
     * Fonction reload() membre de la classe App.
     * Permet de recharger #cryptoMap avec des données à jour pour les 100 premières capitalisations en cryptomonnaies.
     */
    reload()
    {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=fr&precision=max')
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Erreur HTTP! statut: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                document.querySelector('#page_show_error').textContent = '';
                let cards = '';
                data.forEach(cryptoData => {
                    /** Un nouvel objet Crypto est créé seulement si la cryptomonnaie n'est pas déjà intégrée. */
                    if (!this.#cryptoMap.has(cryptoData.id))
                    {
                        let crypto = new Crypto(cryptoData);
                        this.#cryptoMap.set(crypto.id, crypto);
                        cards += this.renderCryptoCard(crypto);
                    }
                    else
                    {
                        this.#cryptoMap.get(cryptoData.id).image = cryptoData.image;
                        this.#cryptoMap.get(cryptoData.id).current_price = cryptoData.current_price;
                        this.#cryptoMap.get(cryptoData.id).market_cap_rank = cryptoData.market_cap_rank;
                        this.#cryptoMap.get(cryptoData.id).market_cap = cryptoData.market_cap;
                        this.#cryptoMap.get(cryptoData.id).high_24h = cryptoData.high_24h;
                        this.#cryptoMap.get(cryptoData.id).low_24h = cryptoData.low_24h;
                        this.#cryptoMap.get(cryptoData.id).price_change_24h = cryptoData.price_change_24h;
                        this.#cryptoMap.get(cryptoData.id).price_change_percentage_24h = cryptoData.price_change_percentage_24h;
                        this.#cryptoMap.get(cryptoData.id).market_cap_change_24h = cryptoData.market_cap_change_24h;
                        this.#cryptoMap.get(cryptoData.id).market_cap_change_percentage_24h = cryptoData.market_cap_change_percentage_24h;
                        this.#cryptoMap.get(cryptoData.id).circulating_supply = cryptoData.circulating_supply;
                        this.#cryptoMap.get(cryptoData.id).total_supply = cryptoData.total_supply;
                        this.#cryptoMap.get(cryptoData.id).max_supply = cryptoData.max_supply;
                    }
                });
                if (cards)
                {
                    document.querySelector('#all_cards').insertAdjacentHTML('beforeend', cards);
                    /** Les cartes nouvellement apparues doivent recevoir leur écouteur 'Voir plus'. */
                    this.setModal(document.querySelectorAll('.voir-plus'));
                }
            })
            .catch((error) => {
                /** Un try/catch autour d'une chaîne de promesses n'intercepte rien : il faut un .catch(). */
                if (document.querySelector('#page_show_error'))
                    document.querySelector('#page_show_error').textContent = `Erreur: ${error.message} !`;
            });
    }
}