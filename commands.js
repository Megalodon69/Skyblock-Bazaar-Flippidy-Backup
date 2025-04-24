// Befehlsbehandlung für Bazaar Flippidy
import { startFlipping, stopFlipping, debugging, playerPurse } from './index';
import Settings from './config';
import * as Utils from './utils';
import UI from './ui';
import * as ProfitTracker from './profitTracker';

/**
 * Registriert alle Befehle für das Modul
 */
export function registerCommands() {
    // Haupt-Befehl mit Unterbefehlsverarbeitung
    register("command", (...args) => {
        if (args.length === 0) {
            // Wenn keine Argumente angegeben sind, zeige die Hauptbenutzeroberfläche an
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
    }).setName("flippidy").setAliases(["flip"]);
    
    // Debug-Befehl
    register("command", (...args) => {
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