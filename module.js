// BazaarFlippidy - ChatTriggers Modul
// Haupteinstiegspunkt für ChatTriggers

// Debug-Nachricht zur Überwachung der Modulladung
ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: module.js wird geladen...");

// Befehlsregistrierung - DIREKT mit einfachen Funktionen ohne Imports
register("command", function(...args) {
    ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: /flippidy Befehl wurde aufgerufen!");
    
    try {
        // Versuche, Haupt-UI zu öffnen
        if (args.length === 0) {
            ChatLib.chat("§5[§dBazaarFlippidy§5]§r Öffne UI...");
            
            // Direkt UI-Datei importieren
            const UI = require("./ui");
            if (UI && typeof UI.toggleMainUI === 'function') {
                UI.toggleMainUI();
                ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: UI.toggleMainUI() wurde aufgerufen");
            } else {
                ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: UI.toggleMainUI ist keine Funktion");
            }
        }
        // Hauptfunktionalität aus index.js laden
        else {
            try {
                const mainModule = require("./index");
                if (mainModule && typeof mainModule.handleFlippidyCommand === 'function') {
                    // Stelle sicher, dass args definiert ist, bevor es verwendet wird
                    const safeArgs = args || [];
                    mainModule.handleFlippidyCommand(...safeArgs);
                    ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: handleFlippidyCommand in index.js wurde aufgerufen");
                } else {
                    ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: handleFlippidyCommand in index.js konnte nicht aufgerufen werden");
                }
            } catch (e) {
                ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: Fehler beim Ausführen: " + e.toString());
            }
        }
    } catch (e) {
        ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: Fehler: " + e.toString());
    }
}).setName("flippidy").setAliases(["flip"]);

register("command", function(...args) {
    ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: /fdebug Befehl wurde aufgerufen!");
    
    try {
        const mainModule = require("./index");
        if (mainModule && typeof mainModule.handleDebugCommand === 'function') {
            mainModule.handleDebugCommand(...args);
            ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: handleDebugCommand in index.js wurde aufgerufen");
        } else {
            ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: Debug-Modus umgeschaltet");
        }
    } catch (e) {
        ChatLib.chat("§5[§dBazaarFlippidy§5]§r DEBUG: Fehler beim Debug-Umschalten: " + e.toString());
    }
}).setName("fdebug").setAliases(["flippidydebug"]);

// Initialisierungsnachricht
ChatLib.chat("§5[§dBazaarFlippidy§5]§r Modul wird geladen... Benutze /flippidy für die Benutzeroberfläche.");

// Export eine einfache API für den Zugriff durch andere Module
module.exports = {
    name: "BazaarFlippidy",
    version: "1.0.0",
    description: "Automatisches Bazaar Flipping für Hypixel Skyblock"
};