"use strict";
var firework;
(function (firework) {
    /**
     * Diese Klasse steht für ein Partikel einer Raketenexplosion, also einen Kreis
     */
    class RocketExplosionParticle {
        constructor(timeToLive, size, posX, posY, color, particleWidth, context) {
            this.timeToLive = timeToLive;
            this.size = size;
            this.posX = posX;
            this.posY = posY;
            this.color = color;
            this.particleWidth = particleWidth;
            this.context = context;
            this.iterations = 0;
        }
        /**
         * Wird von Rocket ausgeführt
         * Überprüft, ob Kreis oft genug gezeichnet wurde (_endOfLife)
         * Falls er nicht oft genug gezeichnet wurde, wird er gezeichnet
         */
        updateRocketExplosionParticle() {
            this.iterations++; // Erhöht Anzahl der Durchläufe durch eins
            if (this.iterations <= this.timeToLive) { // Falls noch nicht oft genug gezeichnet
                // Zeichne Kreis
                this.context.beginPath();
                this.context.setLineDash([1, 5]); // Lege fest, wie viele Unterteilungen die Linie des Kreises hat.
                // (der Array [1,5] gibt das Verhältnis von Srich zu Lücke an
                this.context.lineWidth = this.particleWidth; // Setze Dicke der Linie
                this.context.strokeStyle = this.color; // Setze Farbe
                this.context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2); // Bereite Kreis vor
                //this.context.rect(this.posX, this.posY, this.size, this.size);
                this.context.closePath();
                this.context.stroke(); // Zeichne Kreis
            }
            else {
                this._endOfLife = true; // Kreis wurde oft genug gezeichnet. (Wird von Rocket automatisch entfernt)
            }
        }
        /**
         * Gibt zurück, ob Kreis oft genug gezeichnet wurde
         */
        get endOfLife() {
            return this._endOfLife;
        }
    }
    firework.RocketExplosionParticle = RocketExplosionParticle;
})(firework || (firework = {}));
//# sourceMappingURL=RocketExplosionParticle.js.map