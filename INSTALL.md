# BazaarFlippidy Installation

## Voraussetzungen
- Minecraft 1.8.9
- Forge für 1.8.9
- ChatTriggers für Minecraft 1.8.9

## Installation

### Methode 1: Manuelles Kopieren
1. Finde deinen ChatTriggers-Modulordner:
   - Windows: `%appdata%/.minecraft/config/ChatTriggers/modules/`
   - macOS: `~/Library/Application Support/minecraft/config/ChatTriggers/modules/`
   - Linux: `~/.minecraft/config/ChatTriggers/modules/`

2. Erstelle einen neuen Ordner mit dem Namen `BazaarFlippidy` in diesem Verzeichnis

3. Kopiere alle Dateien aus diesem Repository in den gerade erstellten Ordner

4. Starte Minecraft neu oder verwende den Befehl `/ct reload` im Spiel

### Methode 2: Verwenden des Import-Befehls
1. Starte Minecraft mit ChatTriggers

2. Gib im Chat ein: `/ct import BazaarFlippidy`

3. Wenn das nicht funktioniert, folge der manuellen Installation

## Fehlerbehebung

Wenn die Befehle im Spiel nicht funktionieren:

1. Überprüfe, ob ChatTriggers richtig installiert ist, indem du `/ct` im Spiel eingibst
2. Führe `/ct modules` aus, um zu prüfen, ob BazaarFlippidy in der Liste der Module erscheint
3. Wenn nicht, versuche `/ct reload` oder starte Minecraft neu
4. Stelle sicher, dass die abhängigen Module installiert sind:
   - `/ct import Vigilance`
   - `/ct import requestV2`

## Abhängigkeiten

Dieses Modul benötigt:
- Vigilance
- requestV2

Du kannst diese installieren mit:
```
/ct import Vigilance
/ct import requestV2
```