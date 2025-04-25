// Befehlsbehandlung für Bazaar Flippidy
const { startFlipping, stopFlipping, debugging, playerPurse } = require('./index');
const Settings = require('./config');
const Utils = require('./utils');
const UI = require('./ui');
const ProfitTracker = require('./profitTracker');

/**
 * Registriert alle Befehle für das Modul
 */
function registerCommands() {
    // Haupt-Befehl mit Unterbefehlsverarbeitung
    register("command", function() {
        // Konvertiere arguments object in ein sicheres Array
        const args = Array.prototype.slice.call(arguments);
        Utils.log(`Befehl /flippidy mit Argumenten: ${args.join(' ')}`, true);

        if (args.length === 0) {
            // Wenn keine Argumente angegeben sind, zeige die Hauptbenutzeroberfläche an
            Utils.log("Öffne die Hauptbenutzeroberfläche...", true);
            UI.toggleMainUI();
            return;
        }
        
        switch (args[0].toLowerCase()) {
            case "help":
                Utils.log("Zeige Hilfe...", true);
                Utils.showHelp();
                break;
                
            case "start":
                Utils.log("Starte Flipping...", true);
                if (!Utils.isOnHypixelSkyblock()) {
                    Utils.log("Du musst dich auf Hypixel SkyBlock befinden, um das Flipping zu starten!", true);
                    Utils.playSound("note.bass", 0.8, 0.5);
                    return;
                }
                startFlipping();
                break;
                
            case "stop":
                Utils.log("Stoppe Flipping...", true);
                stopFlipping();
                break;
                
            case "settings":
                Utils.log("Zeige Einstellungen...", true);
                showSettings();
                break;
                
            case "bz":
            case "bazaar":
                Utils.log("Öffne Bazaar...", true);
                Utils.openBazaar();
                break;
                
            case "stats":
                Utils.log("Zeige Statistiken...", true);
                ProfitTracker.showStatistics();
                break;
                
            case "resetstats":
                Utils.log("Setze Statistiken zurück...", true);
                ProfitTracker.resetSessionStats();
                break;

            case "purse":
                Utils.log("Zeige Geldbeutel...", true);
                showPurse();
                break;
                
            default:
                Utils.log("Unbekannter Befehl. Benutze /flippidy help für Hilfe.", true);
                break;
        }
    }).setName("flippidy").setAliases(["flip"]);
    
    // Debug-Befehl
    register("command", function() {
        // Konvertiere arguments object in ein sicheres Array
        const args = Array.prototype.slice.call(arguments);
        // Ändere den Debug-Status
        debugging = !debugging;
        Utils.log(`Debugging ${debugging ? "aktiviert" : "deaktiviert"}.`);
        Utils.playSound("random.click", 1.0, debugging ? 1.2 : 0.8);
    }).setName("fdebug").setAliases(["flippidydebug"]);
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

// Exportieren der Funktionen für andere Module
module.exports = {
    registerCommands
};