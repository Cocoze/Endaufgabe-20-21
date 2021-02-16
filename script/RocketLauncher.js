"use strict";
var firework;
(function (firework) {
    /**
     * Sagt, welche Rakete sich zeichnen soll
     */
    class RocketLauncher {
        /**
         * Konstruktor, der beim Erstellen des Objektes einen leeren Array explosions erstellt
         */
        constructor() {
            this.rockets = [];
        }
        /**
         * Geht einmal durch alle Raketen im rockets array und
         * a) entfernt diese, sofern sie schon lange genug gezeichnet wurden (am Ende ihres Lebens sind)
         * b) weist die Rakete an, sich zu zeichnen und nachzusehen, ob sie jetzt oft genug gezeichnet wurde
         */
        updateRocketLauncher() {
            // mache für alle Rakten im rockets Array das Folgende:
            for (let i = 0; i < this.rockets.length; i++) { // this.rockets.length ist die Anzahl der Raketen in dem Array rockets
                if (this.rockets[i].endOfLife) { // frage, ob Rakete am Ende ihres Lebens ist
                    this.rockets.splice(i, 1); // a) wenn ja, entferne Rakete aus rockets array
                    // (.splice entfernt ein element aus einem array an einer bestimmten Stelle, der Array wird kleiner)
                }
                else { // b) wenn noch nicht am Ende des Lebens:
                    // Rakete anweisen die Explosion zu zeichnen und zu überprüfen, ob sie jetzt am Ende ihres Lebens ist
                    this.rockets[i].updateRocket();
                }
            }
        }
        /**
         * Funktion zum hinzufügen einer neuen Rakete
         * wird durch Main aufgerufen, sobald jemand auf das canvas klickt.
         */
        addRocket(rocket) {
            this.rockets.push(rocket);
        }
    }
    firework.RocketLauncher = RocketLauncher;
})(firework || (firework = {}));
//# sourceMappingURL=RocketLauncher.js.map