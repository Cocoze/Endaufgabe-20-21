namespace firework {

    /**
     * Diese Klasse steht für ein Partikel einer Raketenexplosion, also einen Kreis
     */
    export class RocketExplosionParticle {
        /**
         * Die Werte des Partikels (Kreis)
         * werden bis auf Größe (size) und Durchläufe (iterations) und Lebensende(_endOfLife)
         *  von Rakete übernommen
         */
        private timeToLive: number;
        private size: number;
        private posX: number;
        private posY: number;
        private color: string;
        private particleWidth: number;
        private context: CanvasRenderingContext2D;
        private iterations: number; // Wie oft Kreis gezeichnet wurde
        private _endOfLife: boolean; // Ob Kreis oft genug gezeichnet wurde, also iterations gleich timeToLive ist


        constructor(timeToLive: number, size: number, posX: number, posY: number, color: string, particleWidth: number, context: CanvasRenderingContext2D) {
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
            } else {
                this._endOfLife = true; // Kreis wurde oft genug gezeichnet. (Wird von Rocket automatisch entfernt)
            }
        }


        /**
         * Gibt zurück, ob Kreis oft genug gezeichnet wurde
         */
        get endOfLife(): boolean {
            return this._endOfLife;
        }
    }
}