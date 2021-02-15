namespace firework {

    // Finde submit (save) button im HTML Dokument (create.html)
    let submitButton: HTMLElement = document.getElementById('submitbutton') as HTMLElement;
    // Setze fest, dass bei Klick auf diesen Button die handlesubmit-methode (weiter unten) durchgeführt wird
    submitButton.addEventListener("click", handlesubmit);

    /**
     * Sende alle Daten aus dem Formular an den Server (server.ts/js)
     */
    async function handlesubmit(_event: Event): Promise<void> {
        // Finde das form Element im HTML Dokument (create.html)
        let formData: FormData = new FormData(document.forms[0]);
        // Erstelle eine neue Anfrage (Url query) mit allen Daten aus dem Formular
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        // Setze URL zum Server fest: (entweder localhost oder heroku)
        //let url: string = "https://alraune.herokuapp.com/?" + query.toString();
        let url: string = "http://localhost:5001/add?" + query.toString();
        // Warte auf Antwort des Servers
        let response: Response = await fetch(url);
        // Schreibe Antwort des Servers in Console
        console.log(response);
        // Hole den Text der Antwort
        let responseText: string = await response.text();
        // Schreibe den Text der Antwort in einen Alert-Dialog und zeige ihn so dem Nutzer
        alert(responseText);
    }
}


