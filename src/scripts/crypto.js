/** Classe contenant les données de chaque cryptomonnaie. */
export class Crypto
{
    /** Déclaration des données membres de la classe Crypto. */
    id;
    name;
    symbol;
    image;
    current_price;
    market_cap_rank;
    market_cap;
    high_24h;
    low_24h;
    price_change_24h;
    price_change_percentage_24h;
    market_cap_change_24h;
    market_cap_change_percentage_24h;
    circulating_supply;
    total_supply;
    max_supply;

    /**
     * Constructeur de la classe Crypto.
     * Il s'adapte au contenu des données.
     * Cela est obligé par l'utilisation de deux requêtes différentes pour récupérer les 100 premières cryptomonnaies et les résultats des recherches.
     * @param { JSON } cryptoData Données en JSON de la cryptomonnaie à créer.
     */
    constructor(cryptoData)
    {
        /** Utilisation des données des 100 premières capitalisations. */
        if (!cryptoData.market_data)
        {
            this.id = cryptoData.id;
            this.name = cryptoData.name;
            this.symbol = cryptoData.symbol.toUpperCase();
            this.image = cryptoData.image;
            this.current_price = cryptoData.current_price;
            this.market_cap_rank = cryptoData.market_cap_rank;
            this.market_cap = cryptoData.market_cap;
            this.high_24h = cryptoData.high_24h;
            this.low_24h = cryptoData.low_24h;
            this.price_change_24h = cryptoData.price_change_24h;
            this.price_change_percentage_24h = cryptoData.price_change_percentage_24h;
            this.market_cap_change_24h = cryptoData.market_cap_change_24h;
            this.market_cap_change_percentage_24h = cryptoData.market_cap_change_percentage_24h;
            this.circulating_supply = cryptoData.circulating_supply;
            this.total_supply = cryptoData.total_supply;
            this.max_supply = cryptoData.max_supply;
        }
        /** Utilisation des données des résultats des recherches. */
        else
        {
            this.id = cryptoData.id;
            this.name = cryptoData.name;
            this.symbol = cryptoData.symbol.toUpperCase();
            this.image = cryptoData.image.large;
            this.current_price = cryptoData.market_data.current_price.eur;
            this.market_cap_rank = cryptoData.market_cap_rank;
            this.market_cap = cryptoData.market_data.market_cap.eur;
            this.high_24h = cryptoData.market_data.high_24h.eur;
            this.low_24h = cryptoData.market_data.low_24h.eur;
            this.price_change_24h = cryptoData.market_data.price_change_24h_in_currency.eur;
            this.price_change_percentage_24h = cryptoData.market_data.price_change_percentage_24h_in_currency.eur;
            this.market_cap_change_24h = cryptoData.market_data.market_cap_change_24h_in_currency.eur;
            this.market_cap_change_percentage_24h = cryptoData.market_data.market_cap_change_percentage_24h_in_currency.eur;
            this.circulating_supply = cryptoData.market_data.circulating_supply;
            this.total_supply = cryptoData.market_data.total_supply;
            this.max_supply = cryptoData.market_data.max_supply;
        }
    }
}