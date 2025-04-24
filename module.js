// BazaarFlippidy - ChatTriggers Modul
// Alternativer Einstiegspunkt für die Befehlsregistrierung

// Befehlsregistrierung direkt in der obersten Ebene für maximale Kompatibilität
register("command", (...args) => {
    // Leite weiter zur eigentlichen Implementierung
    const mainModule = require("./index");
    if (mainModule && typeof mainModule.handleFlippidyCommand === 'function') {
        mainModule.handleFlippidyCommand.apply(null, args);
    } else {
        // Fallback, falls die Hauptimplementierung nicht verfügbar ist
        if (args.length === 0) {
            ChatLib.chat("§5[§dBazaarFlippidy§5]§r Öffne UI...");
            // Versuche UI zu öffnen, falls verfügbar
            try {
                const UI = require("./ui");
                if (UI && typeof UI.toggleMainUI === 'function') {
                    UI.toggleMainUI();
                }
            } catch (error) {
                ChatLib.chat("§5[§dBazaarFlippidy§5]§r Fehler beim Öffnen der UI: " + error);
            }
            return;
        }
        
        // Grundlegende Hilfe
        if (args[0] === "help") {
            ChatLib.chat("§e=== BazaarFlippidy Hilfe ===§r");
            ChatLib.chat("/flippidy - Öffnet die Hauptoberfläche");
            ChatLib.chat("/flippidy help - Zeigt diese Hilfeseite an");
            ChatLib.chat("§e=========================§r");
        }
    }
}).setName("flippidy").setAliases(["flip"]);

register("command", () => {
    // Leite weiter zur eigentlichen Debug-Implementierung
    const mainModule = require("./index");
    if (mainModule && typeof mainModule.handleDebugCommand === 'function') {
        mainModule.handleDebugCommand();
    } else {
        // Fallback, falls die Hauptimplementierung nicht verfügbar ist
        ChatLib.chat("§5[§dBazaarFlippidy§5]§r Debug-Modus umgeschaltet.");
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