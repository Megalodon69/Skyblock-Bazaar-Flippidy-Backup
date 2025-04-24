// Profit-Tracking für Bazaar Flippidy
import Settings from './config';
import * as Utils from './utils';

// Importiere FileLib für die persistente Speicherung
const FileLib = Java.type('FileLib');

// Statistik-Daten
let statistics = {
    totalProfit: 0,
    flipsCompleted: 0,
    startTimestamp: 0,
    sessionProfit: 0,
    lastResetTimestamp: 0,
    profitHistory: [], // Speichert [timestamp, profit] Paare für die Berechnung des stündlichen Profits
    lastHourProfit: 0,
    bestFlip: {
        itemId: null,
        profit: 0
    },
    dailyStats: {} // Speichert tägliche Statistiken im Format {"YYYY-MM-DD": {profit: x, flips: y}}
};

/**
 * Initialisiert oder setzt den Profit-Tracker zurück
 */
export function initialize() {
    statistics.startTimestamp = Date.now();
    statistics.lastResetTimestamp = Date.now();
    
    // Versuche, gespeicherte Statistiken zu laden
    loadStatistics();
    
    // Starte die stündliche Profit-Berechnung
    updateHourlyProfit();
    
    Utils.debug('Profit-Tracker initialisiert.');
}

/**
 * Registriert einen abgeschlossenen Flip und seinen Gewinn
 * @param {object} flip Das Flip-Objekt
 * @param {number} actualProfit Der tatsächliche Gewinn
 */
export function recordFlip(flip, actualProfit) {
    const now = Date.now();
    
    // Aktualisiere die Statistiken
    statistics.totalProfit += actualProfit;
    statistics.sessionProfit += actualProfit;
    statistics.flipsCompleted++;
    
    // Füge den Profit zur Historie hinzu
    statistics.profitHistory.push([now, actualProfit]);
    
    // Entferne veraltete Einträge (älter als 1 Stunde)
    const oneHourAgo = now - 3600000;
    statistics.profitHistory = statistics.profitHistory.filter(entry => entry[0] >= oneHourAgo);
    
    // Überprüfe, ob dies der beste Flip ist
    if (actualProfit > statistics.bestFlip.profit) {
        statistics.bestFlip = {
            itemId: flip.itemId,
            profit: actualProfit
        };
    }
    
    // Aktualisiere die täglichen Statistiken
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    if (!statistics.dailyStats[today]) {
        statistics.dailyStats[today] = {
            profit: 0,
            flips: 0
        };
    }
    statistics.dailyStats[today].profit += actualProfit;
    statistics.dailyStats[today].flips++;
    
    // Speichere die aktualisierten Statistiken
    saveStatistics();
    
    // Protokolliere den Gewinn im Chat
    Utils.log(`Flip abgeschlossen! ${flip.itemId} brachte ${Utils.formatNumber(actualProfit)} Münzen Gewinn.`, true);
    
    // Spiele einen Sound bei besonders gutem Flip
    if (actualProfit > Settings.minProfitAmount * 2) {
        Utils.playSound("random.levelup", 1.0, 1.0);
    } else {
        Utils.playSound("random.orb", 1.0, 1.0);
    }
}

/**
 * Berechnet den durchschnittlichen stündlichen Profit basierend auf der Historie
 * Diese Funktion wird regelmäßig aufgerufen
 */
function updateHourlyProfit() {
    const now = Date.now();
    
    // Berechne den Gesamtgewinn in der Historie
    let totalHourProfit = 0;
    statistics.profitHistory.forEach(entry => {
        totalHourProfit += entry[1];
    });
    
    // Berechne den stündlichen Profit
    if (statistics.profitHistory.length > 0) {
        const oldestEntry = statistics.profitHistory[0][0];
        const timeSpan = (now - oldestEntry) / 3600000; // in Stunden
        
        // Wenn genug Daten für eine sinnvolle Berechnung vorliegen
        if (timeSpan > 0.1) { // mindestens 6 Minuten Daten
            statistics.lastHourProfit = totalHourProfit / timeSpan;
        }
    }
    
    // Aktualisiere stündlich
    setTimeout(updateHourlyProfit, 60000); // alle 60 Sekunden aktualisieren
}

/**
 * Gibt eine Zusammenfassung der Profit-Statistiken zurück
 * @returns {object} Statistiken
 */
export function getStatistics() {
    const now = Date.now();
    const sessionDuration = (now - statistics.startTimestamp) / 3600000; // in Stunden
    
    return {
        totalProfit: statistics.totalProfit,
        sessionProfit: statistics.sessionProfit,
        flipsCompleted: statistics.flipsCompleted,
        hourlyProfit: statistics.lastHourProfit,
        sessionTime: sessionDuration,
        bestFlip: statistics.bestFlip,
        dailyStats: statistics.dailyStats
    };
}

/**
 * Zeigt die aktuellen Statistiken im Chat an
 */
export function showStatistics() {
    const stats = getStatistics();
    
    Utils.log(`${Utils.COLORS.YELLOW}=== Flip-Statistiken ===${Utils.COLORS.RESET}`, false);
    Utils.log(`Gesamtgewinn: ${Utils.COLORS.GREEN}${Utils.formatNumber(stats.totalProfit)} Münzen${Utils.COLORS.RESET}`, false);
    Utils.log(`Sitzungsgewinn: ${Utils.COLORS.GREEN}${Utils.formatNumber(stats.sessionProfit)} Münzen${Utils.COLORS.RESET}`, false);
    Utils.log(`Stündlicher Gewinn: ${Utils.COLORS.GREEN}${Utils.formatNumber(stats.hourlyProfit)} Münzen/h${Utils.COLORS.RESET}`, false);
    Utils.log(`Abgeschlossene Flips: ${Utils.COLORS.AQUA}${stats.flipsCompleted}${Utils.COLORS.RESET}`, false);
    
    if (stats.bestFlip.itemId) {
        Utils.log(`Bester Flip: ${Utils.COLORS.AQUA}${stats.bestFlip.itemId}${Utils.COLORS.RESET} (${Utils.COLORS.GREEN}${Utils.formatNumber(stats.bestFlip.profit)} Münzen${Utils.COLORS.RESET})`, false);
    }
    
    const sessionHours = Math.floor(stats.sessionTime);
    const sessionMinutes = Math.floor((stats.sessionTime - sessionHours) * 60);
    Utils.log(`Sitzungsdauer: ${sessionHours}h ${sessionMinutes}m`, false);
    
    // Zeige heutige Statistiken
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    if (statistics.dailyStats[today]) {
        const todayStats = statistics.dailyStats[today];
        Utils.log(`${Utils.COLORS.YELLOW}Heute:${Utils.COLORS.RESET} ${Utils.COLORS.GREEN}${Utils.formatNumber(todayStats.profit)} Münzen${Utils.COLORS.RESET} (${Utils.COLORS.AQUA}${todayStats.flips} Flips${Utils.COLORS.RESET})`, false);
    }
    
    Utils.log(`${Utils.COLORS.YELLOW}=====================${Utils.COLORS.RESET}`, false);
}

/**
 * Setzt die Sitzungsstatistiken zurück
 */
export function resetSessionStats() {
    statistics.sessionProfit = 0;
    statistics.lastResetTimestamp = Date.now();
    Utils.log("Sitzungsstatistiken wurden zurückgesetzt.", true);
    Utils.playSound("random.click", 1.0, 1.0);
}

/**
 * Speichert die Statistiken in einer Datei
 */
function saveStatistics() {
    try {
        // Erstelle ein Objekt mit den wichtigsten zu speichernden Daten
        const dataToSave = {
            totalProfit: statistics.totalProfit,
            flipsCompleted: statistics.flipsCompleted,
            bestFlip: statistics.bestFlip,
            dailyStats: statistics.dailyStats,
            lastSaved: Date.now()
        };
        
        // Verwende FileLib zum Speichern der Daten
        FileLib.write("BazaarFlippidy", "statistics.json", JSON.stringify(dataToSave, null, 2));
        Utils.debug("Statistiken gespeichert");
        return true;
    } catch (error) {
        Utils.debug(`Fehler beim Speichern der Statistiken: ${error}`);
        return false;
    }
}

/**
 * Lädt gespeicherte Statistiken aus einer Datei
 */
function loadStatistics() {
    try {
        // Überprüfe, ob die Datei existiert
        if (FileLib.exists("BazaarFlippidy", "statistics.json")) {
            // Lese die Datei
            const savedData = JSON.parse(FileLib.read("BazaarFlippidy", "statistics.json"));
            
            // Übertrage die gespeicherten Werte auf das statistics-Objekt
            if (savedData) {
                statistics.totalProfit = savedData.totalProfit || 0;
                statistics.flipsCompleted = savedData.flipsCompleted || 0;
                statistics.bestFlip = savedData.bestFlip || { itemId: null, profit: 0 };
                statistics.dailyStats = savedData.dailyStats || {};
                
                Utils.debug(`Statistiken geladen: ${Utils.formatNumber(statistics.totalProfit)} Münzen Gesamtgewinn`);
                return true;
            }
        } else {
            Utils.debug("Keine gespeicherten Statistiken gefunden.");
        }
        return false;
    } catch (error) {
        Utils.debug(`Fehler beim Laden der Statistiken: ${error}`);
        return false;
    }
}