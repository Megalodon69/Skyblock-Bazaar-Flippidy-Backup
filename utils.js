// Hilfsfunktionen für das Bazaar Flippidy Modul
import Settings from './config';

// Variable für den Debug-Status, die jetzt direkt in dieser Datei verwaltet wird
let isDebugging = true; // Standardmäßig aktiviert für Fehlerbehebung

// Chatfarben für Minecraft
export const COLORS = {
    RESET: "§r",
    BLACK: "§0",
    DARK_BLUE: "§1",
    DARK_GREEN: "§2",
    DARK_AQUA: "§3",
    DARK_RED: "§4",
    DARK_PURPLE: "§5",
    GOLD: "§6",
    GRAY: "§7",
    DARK_GRAY: "§8",
    BLUE: "§9",
    GREEN: "§a",
    AQUA: "§b",
    RED: "§c",
    LIGHT_PURPLE: "§d",
    YELLOW: "§e",
    WHITE: "§f",
    BOLD: "§l",
    ITALIC: "§o",
    UNDERLINE: "§n",
    STRIKE: "§m"
};

// Prefix für alle Chat-Nachrichten
const PREFIX = `${COLORS.DARK_PURPLE}[${COLORS.LIGHT_PURPLE}BazaarFlippidy${COLORS.DARK_PURPLE}]${COLORS.RESET} `;

/**
 * Gibt eine Nachricht im Chat aus
 * @param {string} message Die auszugebende Nachricht
 * @param {boolean} showPrefix Ob der Prefix angezeigt werden soll
 */
export function log(message, showPrefix = true) {
    const msg = showPrefix ? PREFIX + message : message;
    ChatLib.chat(msg);
}

/**
 * Gibt eine Debug-Nachricht im Chat aus, wenn Debugging aktiviert ist
 * @param {string} message Die auszugebende Debug-Nachricht
 */
export function debug(message) {
    if (isDebugging) {
        log(`${COLORS.GRAY}[DEBUG] ${message}${COLORS.RESET}`);
    }
}

/**
 * Aktiviert oder deaktiviert den Debug-Status
 * @param {boolean} status Der neue Status (true für aktiviert, false für deaktiviert)
 */
export function setDebugging(status) {
    isDebugging = status;
}

/**
 * Ruft den aktuellen Debug-Status ab
 * @returns {boolean} Der aktuelle Debug-Status
 */
export function getDebugging() {
    return isDebugging;
}

/**
 * Formatiert eine Zahl mit Kommas für Tausender
 * @param {number} number Die zu formatierende Zahl
 * @returns {string} Die formatierte Zahl
 */
export function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Öffnet den Bazaar, entweder durch Klicken auf den NPC oder durch Ausführen des Befehls
 * @returns {boolean} True, wenn der Bazaar erfolgreich geöffnet wurde, sonst false
 */
export function openBazaar() {
    try {
        // Versuche, den /bz-Befehl zu verwenden
        debug("Versuche Bazaar mit /bz zu öffnen");
        ChatLib.command("bz");
        
        // Kleiner Timeout, um zu warten, bis der Bazaar geöffnet ist
        setTimeout(() => {
            if (!isInBazaar()) {
                log("Konnte den Bazaar nicht automatisch öffnen.", true);
                log("Bitte besuche den Bazaar-Händler im Dorf, um fortzufahren.", true);
            } else {
                debug("Bazaar erfolgreich geöffnet!");
            }
        }, 1000);
        
        return true;
    } catch (error) {
        // Wenn der Befehl fehlschlägt, informiere den Benutzer
        log("Fehler beim Öffnen des Bazaars: " + error, true);
        log("Bitte besuche den Bazaar-Händler im Dorf, um fortzufahren.", true);
        
        return false;
    }
}

/**
 * Zeigt die Hilfe für das Modul an
 */
export function showHelp() {
    log(`${COLORS.YELLOW}=== BazaarFlippidy Hilfe ===${COLORS.RESET}`, false);
    log(`/flippidy - Öffnet die Hauptoberfläche`, false);
    log(`/flippidy help - Zeigt diese Hilfeseite an`, false);
    log(`/flippidy start - Startet das automatische Flipping`, false);
    log(`/flippidy stop - Stoppt das automatische Flipping`, false);
    log(`/flippidy settings - Öffnet die Einstellungen`, false);
    log(`/flippidy stats - Zeigt die Gewinnstatistiken an`, false);
    log(`/flippidy resetstats - Setzt die Sitzungsstatistiken zurück`, false);
    log(`/fdebug - Schaltet den Debug-Modus um`, false);
    log(`${COLORS.YELLOW}=========================${COLORS.RESET}`, false);
}

/**
 * Überprüft, ob der Spieler sich im Bazaar-Menü befindet
 * @returns {boolean} True, wenn der Spieler im Bazaar ist, sonst false
 */
export function isInBazaar() {
    try {
        // Überprüfe, ob ein Inventarbildschirm geöffnet ist
        const inventory = Player.getOpenedInventory();
        if (!inventory) return false;
        
        // Überprüfe den Namen des Inventars (kann je nach Sprache variieren)
        const title = inventory.getName();
        
        // Prüfe auf verschiedene mögliche Titel für den Bazaar
        return title && (
            title.includes("Bazaar") || 
            title.includes("Basar") || 
            title.includes("Marktplatz") || 
            title.includes("Market")
        );
    } catch (error) {
        debug(`Fehler bei Bazaar-Erkennung: ${error}`);
        return false;
    }
}

/**
 * Führt ein bestimmtes Element im Inventar aus, um es anzuklicken
 * @param {number} slot Der Slot des Elements
 * @param {number} [clickType=0] Die Klick-Art (0=links, 1=rechts)
 * @returns {boolean} True bei Erfolg, sonst false
 */
export function clickInventorySlot(slot, clickType = 0) {
    try {
        // Überprüfe, ob ein Inventar geöffnet ist
        const inventory = Player.getOpenedInventory();
        if (!inventory) {
            debug("Kein Inventar geöffnet.");
            return false;
        }
        
        // Klicke auf den Slot
        inventory.click(slot, clickType);
        debug(`Klick auf Inventarslot ${slot} (${clickType === 0 ? "links" : "rechts"})`);
        
        return true;
    } catch (error) {
        debug(`Fehler beim Klicken auf Slot ${slot}: ${error}`);
        return false;
    }
}

/**
 * Liest den aktuellen Münzstand (purse) des Spielers aus 
 * @returns {number} Der Münzstand des Spielers oder 0, wenn nicht verfügbar
 */
export function getPlayerPurse() {
    try {
        // In ChatTriggers können wir Scoreboard-Informationen abrufen
        const scoreboardLines = Scoreboard.getLines();
        let purse = 0;
        
        // Suche nach der Zeile mit dem Münzstand
        // Typische Formate: "Purse: 123.4k" oder "Münzen: 123.456"
        for (let line of scoreboardLines) {
            // Entferne Farb- und Formatierungscodes
            const cleanLine = ChatLib.removeFormatting(line);
            
            // Suche nach dem Purse-Eintrag im Scoreboard
            if (cleanLine.includes("Purse:") || cleanLine.includes("Münzen:") || cleanLine.includes("Coins:")) {
                debug(`Gefundene Münzzeile: ${cleanLine}`);
                
                // Extrahiere den Zahlenwert
                const matches = cleanLine.match(/[\d,.]+[kKmMbB]?/);
                if (matches && matches.length > 0) {
                    const valueStr = matches[0];
                    purse = parseCoins(valueStr);
                    debug(`Extrahierter Münzstand: ${purse}`);
                    return purse;
                }
            }
        }
        
        debug("Konnte den Münzstand nicht aus dem Scoreboard lesen.");
        return 0;
    } catch (error) {
        debug(`Fehler beim Lesen des Münzstands: ${error}`);
        return 0;
    }
}

/**
 * Konvertiert einen Münzwert-String (z.B. "1.5k" oder "2.3M") in eine Zahl
 * @param {string} valueStr Der zu konvertierende String
 * @returns {number} Der Münzwert als Zahl
 */
function parseCoins(valueStr) {
    // Entferne Tausendertrennzeichen
    let value = valueStr.replace(/,/g, '');
    
    // Umwandlung von Suffixen (k, M, B) in Zahlen
    const multiplier = {
        'k': 1000,
        'K': 1000,
        'm': 1000000,
        'M': 1000000,
        'b': 1000000000,
        'B': 1000000000
    };
    
    // Überprüfe, ob ein Multiplikator vorhanden ist
    const lastChar = value.slice(-1);
    if (multiplier[lastChar]) {
        // Entferne den Suffix und multipliziere mit dem entsprechenden Faktor
        value = parseFloat(value.slice(0, -1)) * multiplier[lastChar];
    } else {
        // Wenn kein Suffix vorhanden ist, konvertiere einfach zu einer Zahl
        value = parseFloat(value);
    }
    
    return value || 0;
}

/**
 * Gibt einen Sound für Benachrichtigungen aus
 * @param {string} soundName Der Name des Sounds (valid Minecraft sound)
 * @param {number} [pitch=1.0] Die Tonhöhe des Sounds
 * @param {number} [volume=1.0] Die Lautstärke des Sounds 
 */
export function playSound(soundName = "random.orb", pitch = 1.0, volume = 1.0) {
    try {
        // Verwende die ChatTriggers World.playSound Methode
        World.playSound(soundName, volume, pitch);
    } catch (error) {
        debug(`Fehler beim Abspielen des Sounds: ${error}`);
    }
}

/**
 * Prüft, ob der Spieler sich auf Hypixel Skyblock befindet
 * @returns {boolean} True, wenn der Spieler auf Hypixel Skyblock ist
 */
export function isOnHypixelSkyblock() {
    try {
        // Überprüfe den Scoreboard-Titel
        const scoreTitle = Scoreboard.getTitle();
        if (!scoreTitle) return false;
        
        const cleanTitle = ChatLib.removeFormatting(scoreTitle);
        return cleanTitle.includes("SKYBLOCK");
    } catch (error) {
        debug(`Fehler bei Skyblock-Erkennung: ${error}`);
        return false;
    }
}