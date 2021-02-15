namespace firework {

    /**
     * Die Rakete sagt, welche RaketenPartikel (RocketExplosionParticle) (Kreise)
     * sich zeichnen sollen.
     *
     * Außerdem überprüft sie, ob schon alle Kreise oft genug gezeichnet wurden und
     * setzt dann selbst fest, dass sie fertig ist, in dem sie _endOfLife auf true setzt.
     */
    export class Rocket {
        /**
         * Alle Eigenschaften der Rakete
         */
        private particles: RocketExplosionParticle[]; // Array mit allen Partikeln (Kreisen), die zu dieser Rakete gehören
        private activeParticles: RocketExplosionParticle[]; // Array mit allen Partikeln (Kreisen) die noch am Leben sind und gezeichnet werden sollen
        private posX: number; // Die x-Koordinate des Mittelpunktes der Explosion der Rakete (Mittelpunkt aller Kreise)
        private posY: number;// Die y-Koordinate des Mittelpunktes der Explosion der Rakete (Mittelpunkt aller Kreise)
        private _color: string; // Die Farbe der Kreise
        private _timeToLive: number; // Wie oft jeder Kreis gezeichnet werden soll (wie lange er sichtbar ist)
        private _amountOfParticles: number; // Wie viele Kreise es geben soll
        private _particleWidth: number; // Wie dick die Linien der Kreise sind
        private _context: CanvasRenderingContext2D; // Worauf die Kreise gezeichnet werden sollen (das canvas)
        private _endOfLife: boolean; // Gibt an, ob alle Kreise oft genug gezeichnet wurden und die Rakete fertig ist
        private iterations: number; // Gibt an, wie oft die Rakete schon geupdated wurde (Anzahl der Durchläufe)


        constructor(posX: number, posY: number, color: string, timeToLive: number, amountOfParticles: number, particleWidth: number, context: CanvasRenderingContext2D) {
            this.posX = posX;
            this.posY = posY;
            this._color = color;
            this._timeToLive = timeToLive;
            this._amountOfParticles = amountOfParticles;
            this._particleWidth = particleWidth;
            this._context = context;
            this.particles = [];
            this.activeParticles = [];
            this.iterations = 0;
            this.initialize();
        }


        /**
         * Läuft bei jedem Durchlauf
         */
        updateRocket() {
            /**
             * Damit nicht von Anfang an alle Kreise gezeichnet werden, haben wir zwei arrays (particles und activeParticles)
             * particle enthält von Anfang an alle Kreise und verändert sich nicht. (Kreise werden durch init()-methode hinzugefügt)
             * activeParticles ist am Anfang leer.
             * Damit also bei jedem Durchlauf mehr oder weniger Kreise angezeigt werden,
             * verändern wir den activeParticles array.
             */

            /**
             * Dieser Block ist dafür zuständig, Kreise in den activeParticles Array hinzuzufügen.
             * Solange noch nicht alle Kreise im activeParticles Array sind oder es mal waren,
             * fügen wir jeden Durchlauf den nächsten Kreis zum activeParticles Array hinzu.
             * Solange noch nicht alle Kreise im activeParticles array waren, fügen wir sie also
             * Stück für Stück hinzu, sodass pro Durchlauf ein weiterer Kreis hinzugefügt wird.
             */
            if (this.iterations <= this._amountOfParticles) {
                this.activeParticles.push(this.particles[this.iterations]);
            }


            this.iterations++; // Zählt die Durchläufe hoch

            /**
             * Solange es noch aktive Kreise gibt zeichnen wir diese.
             * Sobald es keine aktiven Kreise mehr gibt, geben wir an,
             * dass die Rakete tot ist.
             * (Sie wird dann vom RocketLauncher automatisch entfernt)
             */
            if (this.activeParticles.length != 0) { // Es gibt noch aktive Kreise

                /**
                 * Führe die folgenden Aktionen für alle Kreise im array activeParticles aus
                 * ist ähnlich wie die for-Schleife im RocketLauncher.
                 * Im RocketLauncher werden für alle Raketen im array die updateRocket-methode ausgeführt,
                 * hier wird für jedes RocketExplosionPartikle (Kreis) die updateRocketExplosion-methode ausgeführt
                 *
                 * Der Rocketlauncher updated also die Rakete und diese updated wiederum die Kreise

                 */


                /**
                 * Geht einmal durch alle Kreise im activeParticles array und
                 * a) entfernt diese, sofern sie schon lange genug gezeichnet wurden (am Ende ihres Lebens sind)
                 * b) weist den Kreis an, sich zu zeichnen und nachzusehen, ob er jetzt oft genug gezeichnet wurde
                 */

                // Führe für alle RocketExplosionPartikles (Kreise) im activeParticles array das folgende aus:
                for (let i: number = 0; i < this.activeParticles.length; i++) {

                    // Siehe Kommentare in for-schleife vom RocketLauncher
                    if (this.activeParticles[i].endOfLife) {
                        this.activeParticles.splice(i, 1);
                        // (.splice entfernt ein element aus einem array an einer bestimmten Stelle, der Array wird kleiner)

                    } else {
                        // Particle zeichnen
                        this.activeParticles[i].updateRocketExplosionParticle();
                    }
                }

            } else { // Es gibt keine aktiven Kreise mehr
                this._endOfLife = true; // angeben, dass diese Rakete tot ist
            }
        }

        /**
         * Diese methode wird am Anfang (im Konstruktor) einmal ausgeführt und erstellt alle benötigten Kreise
         * Es werden so viele Kreise erstellt, wie in _amountOfParticles festgelegt wurde
         *  (dieser Wert wird ganz ursprünglich vom Nutzer beim Erstellen einer Raketenvorlage (create.html) festgelegt
         *
         *  Damit die Kreise nicht alle übereinander liegen, geben wir jedem Kreis eine unterschiedlcihe Größe (Radius)
         *   Dabei multiplizieren wir die Reihenfolge des Kreises mit 10:
         *    der erste Kreis hat also einen Radius von 1*10 und ist damit der kleineste und innerste. Der zweite dann der zweitinnerste mit einem Radius von 2*10
         */
        initialize() {

            // Mache so oft das folgende wie in _amountOfParticles festgelegt:
            for (let i: number = 0; i <= this._amountOfParticles; i++) {
                /**
                 * Erstelle ein neues RocketExplosionParticle-Objekt (Kreis)
                 *  als Lebenszeit (_timeToLive) geben wir die Lebenszeit an, die der Rakete mitgeteilt wurde.
                 *    die Rakete "lebt" also eigentlich anzahl-ihrer-partikel * Lebenszeit
                 *  als Größe geben wir wie oben beschrieben einen variablen wert basierend auf der Reihenfolge an
                 *  als x und y - Position geben wir den Mittelpunkt, also die x und y -Position der Rakete an
                 *  die Farbe, die Breite der Linie sowie das canvas werden ebenfalls von der Rakete übernommen
                 */
                let particle: RocketExplosionParticle = new RocketExplosionParticle(this._timeToLive, i * 10, this.posX, this.posY, this._color, this._particleWidth, this._context);

                // FÜge das eben erstellte Particle (Kreis) dem array mit allen Partikeln hinzu
                this.particles.push(particle);
            }
        }

        /**
         * Es folgen getter, also Methoden, die die einzelnen Werte der Rakete liefern.
         * Sie werden gebraucht, da wir in der Main zuerst Raketen ohne bestimmte Koordinaten erstellen
         *  und danach dann Raketen mit gleichen Werten + Koordinaten erstellen.
         *  Mit den Gettern können wir also sagen:
         *   erstelle eine neue Rakete und nimm für die Farbe den Wert der anderen Rakete mit .color
         */
        get endOfLife(): boolean {
            return this._endOfLife;
        }

        get color(): string {
            return this._color;
        }

        get timeToLive(): number {
            return this._timeToLive;
        }

        get amountOfParticles(): number {
            return this._amountOfParticles;
        }

        get particleWidth(): number {
            return this._particleWidth;
        }

        get context(): CanvasRenderingContext2D {
            return this._context;
        }
    }
}