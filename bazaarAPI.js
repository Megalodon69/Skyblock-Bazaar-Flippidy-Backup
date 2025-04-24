// Bazaar API Handler für Bazaar Flippidy
import Settings from './config';
import * as Utils from './utils';

// Importiere das requestV2 Modul für API-Anfragen
const request = Java.type("requestV2.Request");

// Cached Bazaar-Daten
let cachedBazaarData = null;
let lastFetchTimestamp = 0;

/**
 * Abrufen von Bazaar-Daten von der Hypixel API
 * @returns {Promise<object>} Die Bazaar-Daten
 */
export async function fetchBazaarData() {
    // Überprüfe, ob wir gecachte Daten verwenden können
    const now = Date.now();
    if (cachedBazaarData && now - lastFetchTimestamp < (Settings.scanInterval * 0.9)) {
        Utils.debug("Verwende gecachte Bazaar-Daten");
        return cachedBazaarData;
    }
    
    Utils.debug("Hole neue Bazaar-Daten von der API");
    
    try {
        // Echte API-Anfrage mit requestV2
        const response = await requestBazaarData();
        
        // Überprüfe, ob die Antwort erfolgreich ist
        if (!response || !response.success) {
            throw new Error("Fehler bei der API-Anfrage");
        }
        
        // Speichere die Daten im Cache
        cachedBazaarData = response.products;
        lastFetchTimestamp = now;
        
        Utils.debug(`Bazaar-Daten erfolgreich geholt mit ${Object.keys(response.products).length} Produkten`);
        return cachedBazaarData;
    } catch (error) {
        Utils.log(`Fehler beim Abrufen von Bazaar-Daten: ${error}`, true);
        throw error;
    }
}

/**
 * Hilfsfunktion für den tatsächlichen API-Request
 */
function requestBazaarData() {
    return new Promise((resolve, reject) => {
        request({
            url: Settings.apiURL,
            method: "GET",
            headers: {
                'User-Agent': 'Mozilla/5.0 (BazaarFlippidy ChatTriggers Module)'
            },
            timeout: 10000, // 10 Sekunden Timeout
            callback: (err, res, body) => {
                if (err) {
                    Utils.log(`API-Anfragefehler: ${err}`, true);
                    reject(err);
                    return;
                }
                
                try {
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (e) {
                    Utils.log(`Fehler beim Parsen der API-Antwort: ${e}`, true);
                    reject(e);
                }
            }
        });
    });
}

/**
 * Findet die besten Flips basierend auf den Bazaar-Daten
 * @param {object} bazaarData Die Bazaar-Daten
 * @param {number} maxItems Die maximale Anzahl von Items, die zurückgegeben werden sollen
 * @returns {Array<object>} Eine Liste der besten Flip-Möglichkeiten
 */
export function findBestFlips(bazaarData, maxItems = 14) {
    const flips = [];
    
    // Für jedes Produkt in den Bazaar-Daten
    Object.keys(bazaarData).forEach(productId => {
        const product = bazaarData[productId];
        
        // Überspringe, wenn nicht genügend Daten vorhanden sind
        if (!product || !product.quick_status) return;
        
        // Extrahiere die benötigten Daten
        const quickStatus = product.quick_status;
        const buyPrice = quickStatus.buyPrice; // Preis, zu dem wir kaufen würden (höchster Kaufangebotspreis)
        const sellPrice = quickStatus.sellPrice; // Preis, zu dem wir verkaufen würden (niedrigster Verkaufsangebotspreis)
        
        // Überspringe, wenn die Preise nicht gültig sind
        if (!buyPrice || !sellPrice || buyPrice <= 0 || sellPrice <= 0) return;
        
        // Berechne den potenziellen Gewinn
        const profit = sellPrice - buyPrice - (buyPrice * 0.0125); // Berücksichtige 1.25% Bazaar-Steuer
        const profitPercentage = (profit / buyPrice) * 100;
        
        // Überprüfe, ob der Gewinn den Mindestanforderungen entspricht
        if (profitPercentage >= Settings.minProfitPercentage && profit >= Settings.minProfitAmount) {
            // Überprüfe auf mögliche Marktmanipulation, wenn diese Option aktiviert ist
            if (Settings.enableManipulationProtection && isMarketManipulated(product)) {
                Utils.debug(`Mögliche Marktmanipulation für ${productId} erkannt - wird übersprungen`);
                return;
            }
            
            // Berechne die optimale Kaufmenge basierend auf verfügbaren Angeboten und Nachfrage
            const amount = calculateOptimalAmount(product);
            
            // Überprüfe Handelsvolumen
            if (quickStatus.volume < Settings.minItemVolume) {
                Utils.debug(`${productId} hat zu geringes Handelsvolumen (${quickStatus.volume}) - wird übersprungen`);
                return;
            }
            
            flips.push({
                itemId: productId,
                buyPrice,
                sellPrice,
                profit,
                profitPercentage,
                amount,
                volume: quickStatus.volume
            });
        }
    });
    
    // Sortiere die Flips nach Gewinnprozentsatz (absteigend)
    flips.sort((a, b) => b.profitPercentage - a.profitPercentage);
    
    // Debug-Log für die Top-Flips
    if (flips.length > 0) {
        Utils.debug(`Bester Flip: ${flips[0].itemId} mit ${flips[0].profitPercentage.toFixed(2)}% Gewinn`);
    } else {
        Utils.debug("Keine profitablen Flips gefunden");
    }
    
    // Begrenze die Anzahl der zurückgegebenen Items
    return flips.slice(0, maxItems);
}

/**
 * Überprüft, ob ein Produkt möglicherweise manipuliert wird
 * @param {object} product Das zu überprüfende Produkt
 * @returns {boolean} True, wenn Manipulation vermutet wird, sonst false
 */
function isMarketManipulated(product) {
    // In einer vollständigen Implementierung würden wir historische Daten vergleichen
    
    const quickStatus = product.quick_status;
    
    // Überprüfe auf ungewöhnlich große Preisspannen
    const buyPrice = quickStatus.buyPrice;
    const sellPrice = quickStatus.sellPrice;
    const priceGap = sellPrice / buyPrice;
    
    // Wenn die Preisspanne zu groß ist, könnte es Manipulation sein
    if (priceGap > Settings.maxPriceGap) {
        return true;
    }
    
    // Überprüfe das Volumen im Vergleich zum üblichen Volumen (falls vorhanden)
    // In einer vollständigen Implementierung würden wir historische Volumendaten speichern
    
    return false;
}

/**
 * Berechnet die optimale Menge für einen Flip
 * @param {object} product Das Produkt
 * @returns {number} Die optimale Kaufmenge
 */
function calculateOptimalAmount(product) {
    // Extrahiere relevante Daten
    const buyOrders = product.buy_summary || [];
    const sellOrders = product.sell_summary || [];
    
    // Überprüfe die Angebots- und Nachfragemenge
    let availableVolume = 0;
    
    // Berechne das verfügbare Volumen aus den Verkaufsangeboten
    if (buyOrders.length > 0) {
        availableVolume = buyOrders[0].amount || 64;
    }
    
    // Begrenze die Menge basierend auf Einstellungen und verfügbarem Budget
    const maxAmount = Math.min(
        availableVolume,
        Settings.maxItemAmount,
        64 // Standard-Stack-Größe als Fallback
    );
    
    // Runde auf sinnvolle Mengen ab (64er, 16er Stack etc.)
    if (maxAmount >= 64) {
        return 64;
    } else if (maxAmount >= 16) {
        return 16;
    } else {
        return Math.max(1, Math.floor(maxAmount));
    }
}