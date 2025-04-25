// Skyblock Bazaar Flippidy
// Ein ChatTriggers-Modul für automatisches Bazaar Flipping auf Hypixel Skyblock
// Autor: GitHub Copilot

import Settings from './config';
import * as BazaarAPI from './bazaarAPI';
import * as Utils from './utils';
import UI from './ui';
import * as ProfitTracker from './profitTracker';

// Globale Variablen
export let inBazaar = false;
export let running = false;
export let activeFlips = [];
export let waitingForSell = [];
export let waitingForBuy = [];
export let playerPurse = 0; // Spieler-Geldbörse

// Erstelle das Modul-Objekt
const Flippidy = {
    name: "BazaarFlippidy",
    version: "1.0.0",
    description: "Automatisches Bazaar Flipping für Hypixel Skyblock"
};

/**
 * Handler für den /flippidy Befehl mit allen Unterbefehlen
 */
export function handleFlippidyCommand(...args) {
    // Debug-Ausgabe hinzufügen
    Utils.debug(`handleFlippidyCommand wurde aufgerufen mit Argumenten: ${args.join(', ')}`);
    
    if (args.length === 0) {
        // Wenn keine Argumente angegeben sind, zeige die Hauptbenutzeroberfläche an
        Utils.debug("Keine Argumente, öffne UI...");
        UI.toggleMainUI();
        return;
    }
    
    switch (args[0].toLowerCase()) {
        case "help":
            Utils.showHelp();
            break;
            
        case "start":
            if (!Utils.isOnHypixelSkyblock()) {
                Utils.log("Du musst dich auf Hypixel SkyBlock befinden, um das Flipping zu starten!", true);
                Utils.playSound("note.bass", 0.8, 0.5);
                return;
            }
            startFlipping();
            break;
            
        case "stop":
            stopFlipping();
            break;
            
        case "settings":
            showSettings();
            break;
            
        case "bz":
        case "bazaar":
            Utils.openBazaar();
            break;
            
        case "stats":
        case "stat":
        case "profit":
            ProfitTracker.showStatistics();
            break;
            
        case "resetstats":
            ProfitTracker.resetSessionStats();
            break;

        case "purse":
            showPurse();
            break;
            
        default:
            Utils.log("Unbekannter Befehl. Benutze /flippidy help für Hilfe.");
            break;
    }
}

/**
 * Handler für den /fdebug Befehl
 */
export function handleDebugCommand(...args) {
    // Debug-Ausgabe hinzufügen
    Utils.debug(`handleDebugCommand wurde aufgerufen mit Argumenten: ${args.join(', ')}`);
    
    Utils.setDebugging(!Utils.getDebugging());
    Utils.log(`Debugging ${Utils.getDebugging() ? "aktiviert" : "deaktiviert"}.`);
    Utils.playSound("random.click", 1.0, Utils.getDebugging() ? 1.2 : 0.8);
}

/**
 * Zeigt die Einstellungs-UI an
 */
function showSettings() {
    Utils.log("Aktuelle Einstellungen:", true);
    
    // Verwende die neue Methode zum Abrufen lesbarer Einstellungen
    const settingLines = Settings.getReadableSettings();
    for (const line of settingLines) {
        Utils.log(line, false);
    }
    
    Utils.log("Bearbeite die config.js-Datei, um Einstellungen zu ändern.");
}

/**
 * Zeigt den aktuellen Geldbeutelstand an
 */
function showPurse() {
    // Aktualisiere den Kontostand
    const currentPurse = Utils.getPlayerPurse();
    
    if (currentPurse > 0) {
        Utils.log(`Dein aktueller Münzstand: ${Utils.COLORS.GOLD}${Utils.formatNumber(currentPurse)}${Utils.COLORS.RESET}`, true);
        Utils.log(`Sicherheitsreserve: ${Utils.COLORS.YELLOW}${Utils.formatNumber(Settings.minPurseSafety)}${Utils.COLORS.RESET}`, false);
        Utils.log(`Verfügbar für Flipping: ${Utils.COLORS.GREEN}${Utils.formatNumber(currentPurse - Settings.minPurseSafety)}${Utils.COLORS.RESET}`, false);
    } else {
        Utils.log("Konnte den Münzstand nicht abrufen. Bist du auf Skyblock?", true);
    }
}

// Hauptfunktionen für das Flipping
export function startFlipping() {
    if (running) {
        Utils.log("Flipping läuft bereits!", true);
        return;
    }
    
    if (!inBazaar) {
        Utils.log("Du musst im Bazaar sein, um das Flipping zu starten!", true);
        Utils.log("Benutze /bz oder gehe zum Bazaar-Händler", true);
        return;
    }
    
    // Aktualisiere den Kontostand des Spielers
    updatePlayerPurse();
    
    if (Settings.useBudgetCheck && playerPurse <= Settings.minPurseSafety) {
        Utils.log(`Du hast nicht genügend Münzen! Mindestens ${Utils.formatNumber(Settings.minPurseSafety)} benötigt.`, true);
        return;
    }
    
    running = true;
    Utils.log("Flipping gestartet.", true);
    findAndExecuteFlips();
}

export function stopFlipping() {
    running = false;
    Utils.log("Flipping gestoppt.", true);
}

/**
 * Aktualisiert den Kontostand des Spielers
 * @returns {number} Der aktuelle Kontostand
 */
export function updatePlayerPurse() {
    const newPurse = Utils.getPlayerPurse();
    
    if (newPurse > 0) {
        playerPurse = newPurse;
        Utils.debug(`Münzen aktualisiert: ${Utils.formatNumber(playerPurse)}`);
    } else {
        Utils.debug("Konnte Münzstand nicht aktualisieren.");
    }
    
    return playerPurse;
}

/**
 * Überprüft, ob genügend Budget für einen Flip vorhanden ist
 * @param {number} cost Die Kosten für den Flip
 * @returns {boolean} True, wenn genügend Budget vorhanden ist
 */
function hasSufficientBudget(cost) {
    // Aktualisiere den Kontostand
    updatePlayerPurse();
    
    // Berechne das verfügbare Budget unter Berücksichtigung aktiver Flips und Sicherheitsreserve
    let reservedFunds = 0;
    activeFlips.forEach(flip => {
        if (flip.status === "buying") {
            reservedFunds += flip.buyPrice * flip.amount;
        }
    });
    
    const availableBudget = playerPurse - Settings.minPurseSafety - reservedFunds;
    
    Utils.debug(`Budget-Prüfung: Verfügbar: ${Utils.formatNumber(availableBudget)}, Benötigt: ${Utils.formatNumber(cost)}`);
    
    return availableBudget >= cost;
}

// Funktion zum Finden und Ausführen von Flips
function findAndExecuteFlips() {
    if (!running) return;
    
    Utils.debug("Suche nach profitablen Flips...");
    
    try {
        BazaarAPI.fetchBazaarData().then(bazaarData => {
            const bestFlips = BazaarAPI.findBestFlips(bazaarData, Settings.maxItems);
            
            bestFlips.forEach(flip => {
                if (activeFlips.length < Settings.maxConcurrentFlips) {
                    const totalCost = flip.buyPrice * flip.amount;
                    
                    // Überprüfe, ob genügend Budget vorhanden ist
                    if (Settings.useBudgetCheck && !hasSufficientBudget(totalCost)) {
                        Utils.debug(`Überspringe Flip für ${flip.itemId} wegen unzureichendem Budget (${Utils.formatNumber(totalCost)} benötigt)`);
                        return;
                    }
                    
                    Utils.debug(`Beginne Flip für ${flip.itemId}: Kaufe für ${flip.buyPrice}, verkaufe für ${flip.sellPrice}, Gewinn: ${flip.profit}%`);
                    executeFlip(flip);
                }
            });
        }).catch(error => {
            Utils.log(`Fehler beim Abrufen der Bazaar-Daten: ${error}`, true);
        });
    } catch (error) {
        Utils.log(`Fehler beim Finden von Flips: ${error}`, true);
    }
    
    // Überprüfe aktive Flips
    checkActiveFlips();
    
    // Zeitplan für den nächsten Scan
    setTimeout(findAndExecuteFlips, Settings.scanInterval);
}

// Funktion zum Ausführen eines Flips
function executeFlip(flip) {
    try {
        // Hier würde die tatsächliche Implementierung der Kauf- und Verkaufslogik sein
        // Da dies aber komplex ist und von ChatTriggers' API abhängt, ist dies ein vereinfachtes Beispiel
        
        Utils.debug(`Kaufe ${flip.amount}x ${flip.itemId}`);
        
        // Berechne die Gesamtkosten des Flips
        const totalCost = flip.buyPrice * flip.amount;
        
        // Platziere Kaufauftrag
        
        // Füge den Flip zur Liste der aktiven Flips hinzu
        activeFlips.push({
            itemId: flip.itemId,
            buyPrice: flip.buyPrice,
            sellPrice: flip.sellPrice,
            amount: flip.amount,
            profit: flip.profit,
            profitPercentage: flip.profitPercentage,
            status: "buying",
            timestamp: Date.now(),
            totalCost: totalCost
        });
        
    } catch (error) {
        Utils.log(`Fehler beim Ausführen des Flips für ${flip.itemId}: ${error}`, true);
    }
}

// Überprüfe den Status der aktiven Flips
function checkActiveFlips() {
    const now = Date.now();
    
    // Überprüfe Kaufaufträge
    for (let i = activeFlips.length - 1; i >= 0; i--) {
        const flip = activeFlips[i];
        
        if (flip.status === "buying" && now - flip.timestamp > Settings.orderTimeout) {
            Utils.debug(`Kaufauftrag für ${flip.itemId} abgelaufen.`);
            activeFlips.splice(i, 1);
        } else if (flip.status === "buying") {
            // Hier würde die Logik sein, um zu überprüfen, ob der Kaufauftrag erfüllt wurde
            // Bei Erfolg status auf "selling" setzen und einen Verkaufsauftrag platzieren
            
            // Simuliere für dieses Beispiel, dass der Kaufauftrag nach einer zufälligen Zeit erfüllt wird
            if (Math.random() < 0.1) { // 10% Chance pro Überprüfung
                Utils.debug(`Kaufauftrag für ${flip.itemId} erfüllt. Platziere Verkaufsauftrag.`);
                flip.status = "selling";
                flip.timestamp = now;
            }
            
        } else if (flip.status === "selling" && now - flip.timestamp > Settings.orderTimeout) {
            Utils.debug(`Verkaufsauftrag für ${flip.itemId} abgelaufen.`);
            activeFlips.splice(i, 1);
        } else if (flip.status === "selling") {
            // Hier würde die Logik sein, um zu überprüfen, ob der Verkaufsauftrag erfüllt wurde
            
            // Simuliere für dieses Beispiel, dass der Verkaufsauftrag nach einer zufälligen Zeit erfüllt wird
            if (Math.random() < 0.1) { // 10% Chance pro Überprüfung
                // Berechne den tatsächlichen Gewinn
                const totalSale = flip.sellPrice * flip.amount;
                const totalCost = flip.totalCost;
                const actualProfit = totalSale - totalCost;
                
                Utils.debug(`Verkaufsauftrag für ${flip.itemId} erfüllt. Gewinn: ${Utils.formatNumber(actualProfit)}`);
                
                // Registriere den abgeschlossenen Flip im Profit-Tracker
                ProfitTracker.recordFlip(flip, actualProfit);
                
                // Entferne den Flip aus der aktiven Liste
                activeFlips.splice(i, 1);
            }
        }
    }
}

// Event-Handler für Bazaar-Erkennung und Münzkonto-Updates
register("renderOverlay", () => {
    // Führe regelmäßige Überprüfungen durch, aber nicht zu oft
    const now = Date.now();
    
    // Überprüfe alle 5 Sekunden den Bazaar-Status und das Münzkonto
    if (running && now % 5000 < 20) { // Führe nur aus, wenn running aktiv ist und etwa alle 5 Sekunden
        // Überprüfe, ob der Spieler noch im Bazaar ist
        inBazaar = Utils.isInBazaar();
        
        // Aktualisiere das Spieler-Konto
        updatePlayerPurse();
        
        // Wenn der Spieler den Bazaar verlassen hat, stoppe das Flipping
        if (!inBazaar && running) {
            Utils.log("Bazaar wurde geschlossen. Flipping wird pausiert.", true);
            running = false;
        }
    }
});

// Initialisierung
function initialize() {
    Utils.log("Bazaar Flippidy initialisiert. Benutze /flippidy, um zu beginnen.", true);
    
    // Initialisiere den Kontostand
    updatePlayerPurse();
    
    // Initialisiere den Profit-Tracker
    ProfitTracker.initialize();
}

initialize();

// Exportiere das Modul für den Zugriff durch andere Module
module.exports = {
    name: Flippidy.name,
    version: Flippidy.version,
    description: Flippidy.description,
    handleFlippidyCommand,
    handleDebugCommand,
    startFlipping,
    stopFlipping,
    updatePlayerPurse
};