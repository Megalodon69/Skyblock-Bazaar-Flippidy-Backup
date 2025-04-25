// Konfiguration für das Bazaar Flippidy Modul
import { COLORS } from './utils';

/**
 * BazaarFlippidy Konfigurationseinstellungen
 */
class Settings {
    constructor() {
        this.version = "1.0.0";
        
        // API-Einstellungen
        this.apiURL = "https://api.hypixel.net/skyblock/bazaar";
        
        // Flip-Einstellungen
        this.minProfitPercentage = 3.0; // Mindestgewinnspanne in Prozent
        this.minProfitAmount = 1000; // Mindestgewinn in Münzen
        this.maxItems = 50; // Maximale Anzahl von Items, die für Flips berücksichtigt werden
        this.maxConcurrentFlips = 13; // Maximale Anzahl gleichzeitiger Flips
        this.maxItemAmount = 1024; // Maximale Anzahl eines Items pro Flip
        this.minItemVolume = 10; // Minimales Handelsvolumen für ein Item
        
        // Budget-Einstellungen
        this.minPurseSafety = 100000; // Mindestbetrag an Münzen, der im Konto verbleiben sollte
        this.useBudgetCheck = true; // Ob die Budget-Prüfung aktiviert sein soll
        
        // Zeitintervalle
        this.scanInterval = 10000; // Intervall für die Überprüfung neuer Flips in ms
        this.orderTimeout = 60000; // Zeitüberschreitung für Aufträge in ms
        this.bazaarCheckInterval = 5000; // Intervall für die Überprüfung des Bazaar-Status
        
        // UI-Einstellungen
        this.defaultUIVisible = true;
        this.uiX = 10; // X-Position des UI
        this.uiY = 10; // Y-Position des UI
        
        // Marktmanipulationsschutz
        this.enableManipulationProtection = true;
        this.maxPriceGap = 1000000; // Maximales Verhältnis zwischen Verkaufs- und Kaufpreis
        this.maxVolumeChangePercent = 50; // Maximale Änderung des Handelsvolumens in Prozent
        this.maxPriceChangePercent = 20; // Maximale Preisänderung in Prozent
        
        // Automatisierungseinstellungen
        this.autoOpenBazaar = true; // Ob der Bazaar automatisch geöffnet werden soll
        this.autoBuyEnabled = true; // Ob automatisches Kaufen aktiviert sein soll
        this.autoSellEnabled = true; // Ob automatisches Verkaufen aktiviert sein soll
        
        // Benachrichtigungseinstellungen
        this.soundNotifications = true; // Ob Soundbenachrichtigungen aktiviert sein sollen
        this.chatNotifications = true; // Ob Chatbenachrichtigungen aktiviert sein sollen
    }
    
    // Lädt benutzerdefinierte Einstellungen aus einer Datei
    loadSettings() {
        try {
            // In einer vollständigen Implementierung würden hier Benutzereinstellungen geladen
            // Verwende FileLib oder eine andere ChatTriggers-API zum Lesen der Einstellungen
            
            // Beispiel:
            // if (FileLib.exists("BazaarFlippidy", "settings.json")) {
            //    const settingsData = FileLib.read("BazaarFlippidy", "settings.json");
            //    const savedSettings = JSON.parse(settingsData);
            //    Object.assign(this, savedSettings);
            // }
            
            return true;
        } catch (error) {
            console.error("Fehler beim Laden der Einstellungen:", error);
            return false;
        }
    }
    
    // Speichert die aktuellen Einstellungen in einer Datei
    saveSettings() {
        try {
            // In einer vollständigen Implementierung würden hier Benutzereinstellungen gespeichert
            // Verwende FileLib oder eine andere ChatTriggers-API zum Schreiben der Einstellungen
            
            // Beispiel:
            // const settingsData = JSON.stringify({
            //    minProfitPercentage: this.minProfitPercentage,
            //    minProfitAmount: this.minProfitAmount,
            //    maxConcurrentFlips: this.maxConcurrentFlips,
            //    minPurseSafety: this.minPurseSafety,
            //    uiX: this.uiX,
            //    uiY: this.uiY,
            //    enableManipulationProtection: this.enableManipulationProtection,
            //    autoOpenBazaar: this.autoOpenBazaar
            // }, null, 2);
            // FileLib.write("BazaarFlippidy", "settings.json", settingsData);
            
            return true;
        } catch (error) {
            console.error("Fehler beim Speichern der Einstellungen:", error);
            return false;
        }
    }
    
    // Gibt die Einstellungen in einem für Menschen lesbaren Format zurück
    getReadableSettings() {
        return [
            `${COLORS.YELLOW}=== Flip-Einstellungen ===${COLORS.RESET}`,
            `Min. Gewinn: ${this.minProfitPercentage}%`,
            `Min. Gewinnbetrag: ${this.minProfitAmount} Münzen`,
            `Max. gleichzeitige Flips: ${this.maxConcurrentFlips}`,
            `Min. Handelsvolumen: ${this.minItemVolume}`,
            `${COLORS.YELLOW}=== Sicherheitseinstellungen ===${COLORS.RESET}`,
            `Marktmanipulationsschutz: ${this.enableManipulationProtection ? COLORS.GREEN + "Aktiviert" : COLORS.RED + "Deaktiviert"}${COLORS.RESET}`,
            `Budget-Sicherheitsreserve: ${this.minPurseSafety} Münzen`,
            `${COLORS.YELLOW}=== Automatisierung ===${COLORS.RESET}`,
            `Auto-Bazaar-Öffnung: ${this.autoOpenBazaar ? COLORS.GREEN + "Aktiviert" : COLORS.RED + "Deaktiviert"}${COLORS.RESET}`,
            `Auto-Kauf: ${this.autoBuyEnabled ? COLORS.GREEN + "Aktiviert" : COLORS.RED + "Deaktiviert"}${COLORS.RESET}`,
            `Auto-Verkauf: ${this.autoSellEnabled ? COLORS.GREEN + "Aktiviert" : COLORS.RED + "Deaktiviert"}${COLORS.RESET}`
        ];
    }
}

export default new Settings();