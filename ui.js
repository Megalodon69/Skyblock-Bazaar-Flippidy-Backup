// UI-Handler für Bazaar Flippidy
import Settings from './config';
import * as Utils from './utils';
import { startFlipping, stopFlipping, activeFlips } from './index';
import * as ProfitTracker from './profitTracker';

// Minecraft-GUI-Klassen
const Gui = Java.type('net.minecraft.client.gui.Gui');
const ScaledResolution = Java.type('net.minecraft.client.gui.ScaledResolution');

class FlippidyUI {
    constructor() {
        this.visible = Settings.defaultUIVisible;
        this.x = Settings.uiX;
        this.y = Settings.uiY;
        this.width = 150;
        this.height = 15; // Basishöhe für die Kopfzeile
        this.dragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.expanded = true;
        this.showStats = false; // Tab für Statistiken
    }

    /**
     * Zeigt die Hauptbenutzeroberfläche an oder blendet sie aus
     */
    toggleMainUI() {
        this.visible = !this.visible;
        Utils.debug(`UI ist jetzt ${this.visible ? 'sichtbar' : 'unsichtbar'}`);
    }

    /**
     * Klappt die Benutzeroberfläche aus oder ein
     */
    toggleExpanded() {
        this.expanded = !this.expanded;
    }
    
    /**
     * Wechselt zwischen Flips und Statistikansicht
     */
    toggleStatsView() {
        this.showStats = !this.showStats;
    }

    /**
     * Rendert die Benutzeroberfläche im HUD
     * Diese Methode wird aufgerufen, wenn das HUD gerendert wird
     */
    render() {
        if (!this.visible) return;

        const mc = Client.getMinecraft();
        const fr = mc.fontRenderer;
        
        // Hintergrund der Kopfzeile
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 180),
            this.x,
            this.y,
            this.width,
            this.height
        );
        
        // Titel
        Renderer.drawString(
            "§d§lBazaar Flippidy",
            this.x + 5,
            this.y + 4,
            false
        );
        
        // Ein-/Ausklapp-Button
        const expandText = this.expanded ? "▼" : "▶";
        Renderer.drawString(
            expandText,
            this.x + this.width - 10,
            this.y + 4,
            false
        );
        
        if (!this.expanded) return;
        
        // Tab-Bereich
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 150),
            this.x,
            this.y + this.height,
            this.width,
            20
        );
        
        // Tabs
        const tabWidth = this.width / 2;
        
        // Flips-Tab
        Renderer.drawRect(
            Renderer.color(20, 20, 20, this.showStats ? 100 : 200),
            this.x,
            this.y + this.height,
            tabWidth,
            20
        );
        
        // Stats-Tab
        Renderer.drawRect(
            Renderer.color(20, 20, 20, this.showStats ? 200 : 100),
            this.x + tabWidth,
            this.y + this.height,
            tabWidth,
            20
        );
        
        // Tab-Beschriftungen
        Renderer.drawString(
            this.showStats ? "Flips" : "§l§eFlips",
            this.x + tabWidth / 2 - 15,
            this.y + this.height + 6,
            false
        );
        
        Renderer.drawString(
            this.showStats ? "§l§eStats" : "Stats",
            this.x + tabWidth + tabWidth / 2 - 15,
            this.y + this.height + 6,
            false
        );
        
        // Hauptbereichshöhe je nach Ansicht
        let mainHeight;
        
        // Zeige entweder Flips oder Statistiken an
        if (this.showStats) {
            mainHeight = 110; // Feste Höhe für den Stats-Bereich
            this.renderStatsArea(mainHeight);
        } else {
            mainHeight = 15 + (activeFlips.length * 10) + 20;
            this.renderFlipsArea(mainHeight);
        }
    }

    /**
     * Rendert den Bereich für aktive Flips
     * @param {number} mainHeight Die Höhe des Hauptbereichs
     */
    renderFlipsArea(mainHeight) {
        // Hintergrund des Hauptbereichs
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 150),
            this.x,
            this.y + this.height + 20,
            this.width,
            mainHeight
        );
        
        // Status-Zeile
        const statusText = `Status: ${activeFlips.length > 0 ? "§aAktiv" : "§cBereit"}`;
        Renderer.drawString(
            statusText,
            this.x + 5,
            this.y + this.height + 25,
            false
        );
        
        // Aktive Flips anzeigen
        if (activeFlips.length > 0) {
            Renderer.drawString(
                "§e§lAktive Flips:",
                this.x + 5,
                this.y + this.height + 40,
                false
            );
            
            activeFlips.forEach((flip, index) => {
                const flipText = `${flip.itemId}: ${Utils.formatNumber(flip.profit)} Gewinn`;
                const statusColor = flip.status === "buying" ? "§b" : "§a";
                Renderer.drawString(
                    `${statusColor}${flipText}`,
                    this.x + 5,
                    this.y + this.height + 50 + (index * 10),
                    false
                );
            });
        } else {
            Renderer.drawString(
                "§7Keine aktiven Flips",
                this.x + 5,
                this.y + this.height + 40,
                false
            );
        }
        
        // Start/Stop-Button
        const buttonY = this.y + this.height + 20 + mainHeight - 15;
        const buttonWidth = this.width / 2 - 5;
        
        // Start-Button
        Renderer.drawRect(
            Renderer.color(0, 150, 0, 180),
            this.x + 5,
            buttonY,
            buttonWidth,
            15
        );
        
        // Stop-Button
        Renderer.drawRect(
            Renderer.color(150, 0, 0, 180),
            this.x + buttonWidth + 10,
            buttonY,
            buttonWidth,
            15
        );
        
        // Button-Texte
        Renderer.drawString(
            "§aStart",
            this.x + buttonWidth / 2 - 10,
            buttonY + 4,
            false
        );
        
        Renderer.drawString(
            "§cStop",
            this.x + buttonWidth + 10 + buttonWidth / 2 - 10,
            buttonY + 4,
            false
        );
    }

    /**
     * Rendert den Bereich für Statistiken
     * @param {number} mainHeight Die Höhe des Hauptbereichs
     */
    renderStatsArea(mainHeight) {
        // Hintergrund des Stats-Bereichs
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 150),
            this.x,
            this.y + this.height + 20,
            this.width,
            mainHeight
        );
        
        // Hole die aktuellen Statistiken
        const stats = ProfitTracker.getStatistics();
        
        // Überschrift
        Renderer.drawString(
            "§e§lProfit-Statistiken",
            this.x + 5,
            this.y + this.height + 25,
            false
        );
        
        // Zeile 1: Gesamtgewinn
        Renderer.drawString(
            `Gesamt: §a${Utils.formatNumber(stats.totalProfit)} Münzen`,
            this.x + 5,
            this.y + this.height + 40,
            false
        );
        
        // Zeile 2: Sitzungsgewinn
        Renderer.drawString(
            `Sitzung: §a${Utils.formatNumber(stats.sessionProfit)} Münzen`,
            this.x + 5,
            this.y + this.height + 50,
            false
        );
        
        // Zeile 3: Stündlicher Gewinn
        Renderer.drawString(
            `Münzen/h: §a${Utils.formatNumber(stats.hourlyProfit)}`,
            this.x + 5,
            this.y + this.height + 60,
            false
        );
        
        // Zeile 4: Abgeschlossene Flips
        Renderer.drawString(
            `Abgeschl. Flips: §e${stats.flipsCompleted}`,
            this.x + 5,
            this.y + this.height + 70,
            false
        );
        
        // Zeile 5: Bester Flip
        if (stats.bestFlip && stats.bestFlip.itemId) {
            Renderer.drawString(
                `Bester Flip: §b${stats.bestFlip.itemId}`,
                this.x + 5,
                this.y + this.height + 80,
                false
            );
            Renderer.drawString(
                `§a${Utils.formatNumber(stats.bestFlip.profit)} Münzen`,
                this.x + 15,
                this.y + this.height + 90,
                false
            );
        }
        
        // Reset-Button
        const buttonY = this.y + this.height + 20 + mainHeight - 15;
        
        Renderer.drawRect(
            Renderer.color(30, 30, 150, 180),
            this.x + 5,
            buttonY,
            this.width - 10,
            15
        );
        
        Renderer.drawString(
            "§9Statistik zurücksetzen",
            this.x + this.width / 2 - 50,
            buttonY + 4,
            false
        );
    }

    /**
     * Behandelt Mausklicke auf die Benutzeroberfläche
     * @param {number} mouseX X-Position des Mauszeigers
     * @param {number} mouseY Y-Position des Mauszeigers
     * @param {number} button Gedrückte Maustaste
     */
    mouseClicked(mouseX, mouseY, button) {
        if (!this.visible) return;
        
        // Überprüfen, ob der Mausklick auf die Kopfzeile trifft (zum Ziehen)
        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
            
            // Überprüfen, ob der Klick auf den Ein-/Ausklapp-Button trifft
            if (mouseX >= this.x + this.width - 15) {
                this.toggleExpanded();
                return;
            }
            
            // Beginne das Ziehen der UI
            this.dragging = true;
            this.dragOffsetX = mouseX - this.x;
            this.dragOffsetY = mouseY - this.y;
            return;
        }
        
        if (!this.expanded) return;
        
        // Überprüfen, ob der Mausklick auf die Tabs trifft
        if (mouseY >= this.y + this.height && mouseY <= this.y + this.height + 20) {
            const tabWidth = this.width / 2;
            
            // Klick auf Flips-Tab
            if (mouseX >= this.x && mouseX <= this.x + tabWidth && this.showStats) {
                this.showStats = false;
                return;
            }
            
            // Klick auf Stats-Tab
            if (mouseX >= this.x + tabWidth && mouseX <= this.x + this.width && !this.showStats) {
                this.showStats = true;
                return;
            }
        }
        
        // Je nach aktiver Ansicht unterschiedliche Klickbehandlung
        if (this.showStats) {
            this.handleStatsClick(mouseX, mouseY);
        } else {
            this.handleFlipsClick(mouseX, mouseY);
        }
    }

    /**
     * Behandelt Mausklicks in der Flips-Ansicht
     * @param {number} mouseX X-Position des Mauszeigers
     * @param {number} mouseY Y-Position des Mauszeigers
     */
    handleFlipsClick(mouseX, mouseY) {
        const mainHeight = 15 + (activeFlips.length * 10) + 20;
        const buttonY = this.y + this.height + 20 + mainHeight - 15;
        const buttonWidth = this.width / 2 - 5;
        
        // Start-Button
        if (mouseX >= this.x + 5 && mouseX <= this.x + 5 + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + 15) {
            startFlipping();
            return;
        }
        
        // Stop-Button
        if (mouseX >= this.x + buttonWidth + 10 && mouseX <= this.x + buttonWidth + 10 + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + 15) {
            stopFlipping();
            return;
        }
    }

    /**
     * Behandelt Mausklicks in der Statistik-Ansicht
     * @param {number} mouseX X-Position des Mauszeigers
     * @param {number} mouseY Y-Position des Mauszeigers
     */
    handleStatsClick(mouseX, mouseY) {
        const mainHeight = 110;
        const buttonY = this.y + this.height + 20 + mainHeight - 15;
        
        // Reset-Button
        if (mouseX >= this.x + 5 && mouseX <= this.x + this.width - 5 &&
            mouseY >= buttonY && mouseY <= buttonY + 15) {
            ProfitTracker.resetSessionStats();
            return;
        }
    }

    /**
     * Behandelt Mausbewegungen für das Ziehen der UI
     * @param {number} mouseX X-Position des Mauszeigers
     * @param {number} mouseY Y-Position des Mauszeigers
     */
    mouseDragged(mouseX, mouseY) {
        if (this.dragging) {
            this.x = mouseX - this.dragOffsetX;
            this.y = mouseY - this.dragOffsetY;
        }
    }

    /**
     * Beendet das Ziehen der UI, wenn die Maustaste losgelassen wird
     */
    mouseReleased() {
        this.dragging = false;
        
        // Speichere die Position für die nächste Sitzung
        Settings.uiX = this.x;
        Settings.uiY = this.y;
        Settings.saveSettings();
    }
}

// Singleton-Instanz
const instance = new FlippidyUI();

// Registriere die UI für das Rendering
register("renderOverlay", () => {
    instance.render();
});

// Registriere die Maus-Event-Handler
register("mouseClicked", (mouseX, mouseY, button) => {
    instance.mouseClicked(mouseX, mouseY, button);
});

register("mouseDragged", (mouseX, mouseY) => {
    instance.mouseDragged(mouseX, mouseY);
});

register("mouseReleased", () => {
    instance.mouseReleased();
});

// Exportiere die Instanz als Standard
export default instance;