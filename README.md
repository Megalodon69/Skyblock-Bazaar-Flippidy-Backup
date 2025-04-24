# Skyblock-Bazaar-Flippidy

Ein vollautomatisches ChatTriggers-Modul für Hypixel Skyblock Bazaar Flipping. Dieses Modul automatisiert den Prozess des Kaufens und Verkaufens von Items im Bazaar, um Gewinn zu erzielen.

## Funktionen

- **Vollautomatisches Flipping**: Identifiziert die profitabelsten Flips und führt sie automatisch aus
- **Mehrere gleichzeitige Flips**: Kann mehrere Kauf- und Verkaufsaufträge parallel verwalten
- **In-Game UI**: Benutzerfreundliche Oberfläche zur Steuerung und Überwachung
- **Marktmanipulationsschutz**: Vermeidet Items, die möglicherweise manipuliert werden
- **Automatisches Bazaar-Öffnen**: Kann den Bazaar automatisch über den /bz-Befehl öffnen
- **Debug-Modus**: Ausführliche Protokollierung für Fehlerbehebung und Transparenz

## Installation

### Voraussetzungen

1. **Minecraft** mit Forge für Version 1.8.9
2. **ChatTriggers** installiert für Forge 1.8.9 (Version 2.0 oder höher)
3. Zugang zu **Hypixel Skyblock**

### Installationsschritte

1. **ChatTriggers installieren** (falls noch nicht installiert):
   - Lade die neueste Version von [ChatTriggers](https://www.chattriggers.com/) herunter
   - Lege die .jar-Datei in deinem Minecraft mods-Ordner ab
   - Starte Minecraft neu

2. **Bazaar Flippidy installieren**:
   - Öffne Minecraft und gehe zu Hypixel
   - Führe den Befehl `/ct import BazaarFlippidy` aus
   - Alternativ:
     - Lade dieses Repository als ZIP herunter
     - Extrahiere es in deinen `.minecraft/config/ChatTriggers/modules/` Ordner
     - Führe `/ct reload` in Minecraft aus

3. **Erste Verwendung**:
   - Vergewissere dich, dass du genügend Münzen zum Flipping hast
   - Führe `/flippidy` aus, um die Benutzeroberfläche zu öffnen
   - Gehe zum Bazaar oder verwende `/bz`, um den Bazaar zu öffnen
   - Klicke auf "Start" in der UI oder führe `/flippidy start` aus, um zu beginnen

## Verwendung

### Befehle

- `/flippidy` oder `/flip` - Öffnet die Hauptbenutzeroberfläche
- `/flippidy help` - Zeigt die Hilfe-Seite mit allen Befehlen an
- `/flippidy start` - Startet das automatische Flipping
- `/flippidy stop` - Stoppt das automatische Flipping
- `/flippidy settings` - Zeigt die aktuellen Einstellungen an
- `/fdebug` oder `/flippidydebug` - Aktiviert oder deaktiviert den Debug-Modus

### Benutzeroberfläche

Die Benutzeroberfläche kann durch Klicken und Ziehen der Titelleiste verschoben werden und bietet folgende Funktionen:

- Anzeige des aktuellen Status
- Liste der aktiven Flips mit Gewinnangaben
- Start- und Stop-Buttons zur Steuerung
- Ein- und Ausklappen der Oberfläche mit dem ▼/▶-Button

### Optimale Einstellungen

Die Standardeinstellungen sind für die meisten Benutzer geeignet, können aber bei Bedarf in der `config.js`-Datei angepasst werden:

- `minProfitPercentage`: Minimale Gewinnspanne in Prozent (Standard: 3%)
- `minProfitAmount`: Minimaler Gewinnbetrag in Münzen (Standard: 1000)
- `maxConcurrentFlips`: Maximale Anzahl gleichzeitiger Flips (Standard: 3)

## Sicherheitshinweise

- **Marktmanipulation**: Das Modul verfügt über einen Schutz gegen Marktmanipulation, der dazu beiträgt, risikoreiche Flips zu vermeiden.
- **API-Rate Limits**: Das Modul berücksichtigt die Hypixel API-Beschränkungen, um temporäre Sperren zu vermeiden.
- **Minecraft ToS**: Die Verwendung erfolgt auf eigene Gefahr. Stelle sicher, dass die Verwendung mit den Hypixel- und Minecraft-Nutzungsbedingungen übereinstimmt.

## Fehlerbehebung

- **UI wird nicht angezeigt**: Versuche, `/ct reload` auszuführen oder Minecraft neu zu starten
- **Flipping startet nicht**: Überprüfe, ob du im Bazaar bist und der API-Zugriff funktioniert
- **Fehler beim API-Zugriff**: Aktiviere den Debug-Modus mit `/fdebug` für detailliertere Fehlerinformationen

## Mitwirkung

Beiträge zum Projekt sind willkommen! Du kannst das Projekt forken und Pull-Requests einreichen, um Verbesserungen vorzuschlagen.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe die [LICENSE](LICENSE)-Datei für Details.