"use strict";
var firework;
(function (firework) {
    /**
     * Reagiert auf Wünsche des Nutzers und sagt dann dem ROcketLauncher,
     * dass eine neue Rakete hinzugefügt werden soll
     *
     *
     *
     * Main ist für die rocket.html verantwortlich
     * Hier wird auf Klicks auf das canvas reagiert und neue Raketen erstellt
     * Die Raketen werden am Anfang vom Server abgerufen (der die Raketen aus der MongoDB lädt)
     */
    // Die Stelle im rockets array, an der die ausgewählte Rakete liegt (am anfang wird das erste gewählt)
    let selectedRocket = 0;
    /**
     * Ein array mit allen Raketen (wird mit loadRockets() mit Daten aus der MongoDB gefüllt)
     * diese Rakten haben noch keine Position
     */
    let rockets = [];
    /**
     * Iniziiere canvas objekt und context
     */
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext("2d");
    // Leere instanz vom Launcher
    let rocketLauncher;
    /**
     * Läuft jedes Frame
     */
    function loop() {
        // alles gezeichnete löschen und hintergrund zeichnen
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        // aktuell anzuzeigende Rakten über den RocketLauncher aktualisieren
        rocketLauncher.updateRocketLauncher();
        // verantwortlich für Endlosschleife
        window.requestAnimationFrame(() => loop());
    }
    /**
     * Neuen Launcher erstellen und alle Raketen mit loadRockets() aus DatenBank lädt
     * wird einmal am Anfang ausgeführt
     */
    function init() {
        rocketLauncher = new firework.RocketLauncher();
        // lade alle Rakten vom Server
        loadRockets();
    }
    // init und loop einmalig ausführen (loop startet sich dann immer wieder selber)
    init();
    loop();
    /**
     * Bei Klick auf eine Stelle im Canvas eine ausgewählte Rakete(selectedRocket) an diese Stelle setzen
     */
    canvas.addEventListener('mousedown', function (e) {
        // Hole x und y Position des Mauszeigers auf Canvas
        const rect = canvas.getBoundingClientRect(); // Information über Mauszeiger
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        // Hole ausgewählte Rakete (hat noch keine direkten Koordinaten)
        let rocketWithoutCoordinates = rockets[selectedRocket];
        // Erstelle Rakete mit allen EIgenschaften der ausgewählten Rakete + den Koordinaten der Maus
        let rocket = new firework.Rocket(x, y, rocketWithoutCoordinates.color, rocketWithoutCoordinates.timeToLive, rocketWithoutCoordinates.amountOfParticles, rocketWithoutCoordinates.particleWidth, context);
        // Rakte mit Koordinaten dem rocketLauncher hinzufügen, der dafür sorgt, dass diese dann auch gezeichnet wird
        rocketLauncher.addRocket(rocket);
    });
    /**
     * Hintergrund zeichnen
     */
    function drawBackground() {
        let schnitt = 0.62;
        let gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(schnitt, "black");
        gradient.addColorStop(1, "darkblue");
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    /**
     * Alle Raketen vom Server laden
     * Jedes wird in einen RocketBlueprint gesteckte
     * Dann wird eine Rakete (rocketWithoutCoordinates) mit diesen Daten erstellt
     *  (Position sowie context bleiben leer/0, werden später mit richitger Rakete hinzugefügt)
     *
     *  Muss async sein, da wir Daten vom Server laden und ja auf die Antwort des Servers warten müssen,
     *  bevor wir weitermachen
     */
    async function loadRockets() {
        //let url: string = "https://xxx.herokuapp.com/get";
        // url zum Server
        let url = "http://localhost:5001/get";
        // Antwort vom Server anfragen
        let response = await fetch(url);
        /**
         * für alle Raketen, die der Server schickt, einen Bauplan erstellen(rocketBlueprint)
         * und diese Baupläne in einen array packen (reply)
         */
        let reply = JSON.parse(await response.text());
        // html element, wo Raketennamen angezeigt werden sollen
        document.getElementById("fireworks").innerHTML = "";
        // gehe durch alle geladenen Raketen
        for (let i = 0; i < reply.length; i++) {
            // -------------------- Anzeige in HTML Webseite --------------------
            // erstelle für jede Rakete ein p element
            let p = document.createElement("p");
            // füge einen Butten mit dem Namen der Rakete zum p element hinzu
            p.innerHTML += "<button class='fireWorkButton'>" + reply[i].Name + "</button><br>";
            // hänge an jeden butten einen EventListener, der bei klick die Rakete dieses Buttons auswählt (mit selectRocket)
            p.addEventListener("click", function () {
                selectRocket(i);
            });
            // füge das p element mit dem button zum html element, wo Raketennamen angezeigt werden sollen, hinzu
            document.getElementById("fireworks").appendChild(p);
            // ------------------------------------------------------------
            /**
             * Erstelle ein Rocket Objekt mit den Daten aus der Antwort des Servers.
             * Da wir hier noch nicht wissen wo die Raketen später gezeichnet werden sollen, setzen wir als
             * Position einfach x = 0 und y = 0. Diese Koordinaten werden dann später beim Klicken auf das
             * Canvas und vor dem eigentlichen Zeichnen angepasst
             *
             * Die erstellte Rakete wird dem Array mit allen Rakten (rockets) hinzugefügt
             */
            rockets.push(new firework.Rocket(0, 0, reply[i].Farbe, parseInt(reply[i].Lebensdauer), parseInt(reply[i].Partikelanzahl), parseInt(reply[i].Partikelbreite), context));
        }
    }
    /**
     * Funktion zum auswählen einer Rakete
     *
     * setzt den Wert (selectedRocket), der angibt, wo im Array (rockets) die aktuell ausgewählte Rakete liegt.
     *
     */
    function selectRocket(i) {
        selectedRocket = i;
    }
})(firework || (firework = {}));
//# sourceMappingURL=Main.js.map