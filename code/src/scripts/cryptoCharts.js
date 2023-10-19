import Chart from 'chart.js/auto'; /** Import de la bibliothèque chart.js afin de tracer des graphes. */

/**
 * Classe qui crée deux graphiques avec les prix sur 24h et 7jours d'une cryptomonnaie.
 * Ces graphiques sont intégrés dans le modal indiquant les détails sur chaque cryptomonnaie.
*/
export class CryptoCharts
{   
    #prices24hChart;
    #prices30jChart;

    /**
     * Constructeur de la classe CryptoCharts qui appelle les fonctions de création de deux graphes (données sur 24h et 7 jours).
     * @param { String } cryptoId L'id de la cryptomonnaie dont on veut afficher les données sur 24h et 7 jours.
     */
    constructor(cryptoId)
    {
        this.set24hPricesChart(cryptoId);
        this.set30jPricesChart(cryptoId);

        /** Lors de la fermeture du modal les deux graphiques sont supprimés. */
        document.querySelector('#main_modal').addEventListener('hide.bs.modal', (event) => {
            if (this.#prices24hChart)
                this.#prices24hChart.destroy();
            if (this.#prices30jChart)
                this.#prices30jChart.destroy();
        });
    }

    /**
     * Crée le graphique de prix de la cryptomonnaie sur 24h.
     * @param { String } cryptoId L'id de la cryptomonnaie dont on affiche les données.
     */
    async set24hPricesChart(cryptoId)
    {
        try
        {
            await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=eur&days=1&precision=max`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Erreur HTTP! statut: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                /** Séparation en deux listes des dates/heures et des prix. */
                let timestamps = [];
                let prices = [];
                data.prices.forEach(tuple => {
                    timestamps.push(new Date(tuple[0]).toLocaleString());
                    prices.push(tuple[1]);
                });

                /** Création du graphe sur 24h. */
                let pricesCtx = document.querySelector('#prices_chart_24h').getContext('2d');
                this.#prices24hChart = new Chart(pricesCtx, {
                    type: 'line',
                    data: {
                        labels: timestamps,
                        datasets: [{
                            label: 'Prix unitaire',
                            data: prices,
                            fill: true,
                            borderColor: 'rgb(64,224,208)'
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                ticks: {
                                callback: value => `${value}€`
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolution du prix durant les dernières 24h.'
                            }
                        }
                    }
                });
            });
        }
        catch (error)
        {
            if (document.querySelector('#chart_show_error'))
                document.querySelector('#chart_show_error').textContent = `Erreur: ${error} !`;
        }
    }

    /** 
     * Crée le graphique de prix de la cryptomonnaie sur 7jours.
     * @param { String } cryptoId L'id de la cryptomonnaie dont on affiche les données.
     */
    async set30jPricesChart(cryptoId)
    {
        try
        {
            await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=eur&days=30&interval=daily&precision=max`)
            .then((response) => {
                if (!response.ok)
                    throw new Error(`Erreur HTTP! statut: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                /** Séparation en deux listes des dates et des prix. */
                let timestamps = [];
                let prices = [];
                data.prices.forEach(tuple => {
                    timestamps.push(new Date(tuple[0]).toLocaleDateString());
                    prices.push(tuple[1]);
                });

                /** Création du graphe sur 7jours. */
                let pricesCtx = document.querySelector('#prices_chart_30j').getContext('2d');
                this.#prices30jChart = new Chart(pricesCtx, {
                    type: 'line',
                    data: {
                        labels: timestamps,
                        datasets: [{
                            label: 'Prix unitaire',
                            data: prices,
                            fill: true,
                            borderColor: 'rgb(255,165,0)'
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                ticks: {
                                callback: value => `${value}€`
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolution du prix durant les derniers 30 jours.'
                            }
                        }
                    }
                });
            });
        }
        catch (error)
        {
            if (document.querySelector('#chart_show_error'))
                document.querySelector('#chart_show_error').textContent = `Erreur: ${error} !`;
        }
    }
}