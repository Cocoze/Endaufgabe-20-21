"use strict";
var firework;
(function (firework) {
    // Finde submit (save) button im HTML Dokument (create.html)
    let submitButton = document.getElementById('submitbutton');
    // Setze fest, dass bei Klick auf diesen Button die handlesubmit-methode (weiter unten) durchgeführt wird
    submitButton.addEventListener("click", handlesubmit);
    /**
     * Sende alle Daten aus dem Formular an den Server (server.ts/js)
     */
    async function handlesubmit(_event) {
        // Finde das form Element im HTML Dokument (create.html)
        let formData = new FormData(document.forms[0]);
        // Erstelle eine neue Anfrage (Url query) mit allen Daten aus dem Formular
        let query = new URLSearchParams(formData);
        // Setze URL zum Server fest: (entweder localhost oder heroku)
        let url = "https://fancyfirework.herokuapp.com/add?" + query.toString();
        //let url: string = "http://localhost:5001/add?" + query.toString();
        // Warte auf Antwort des Servers
        let response = await fetch(url);
        // Schreibe Antwort des Servers in Console
        console.log(response);
        // Hole den Text der Antwort
        let responseText = await response.text();
        // Schreibe den Text der Antwort in einen Alert-Dialog und zeige ihn so dem Nutzer
        alert(responseText);
    }
})(firework || (firework = {}));
//# sourceMappingURL=SendRocketToServer.js.map