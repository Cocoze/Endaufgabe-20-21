"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firework = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var firework;
(function (firework) {
    // Eine MongoDB-Collection die unsere Raketen enthält
    let rockets;
    let port = process.env.PORT; // Port kann entweder eine Nummer, ein Text oder gar nichts sein
    if (port == undefined) // Falls Port nicht angegeben ist, verwende port 5001
        port = 5001;
    // Url zur Datenbank (mondodb Protokoll) enthält url zum Server sowie Nutzername und Passwort
    let databaseUrl = "mongodb+srv://snape:snapi@eia2.lsydz.mongodb.net/Firework?retryWrites=true&w=majority";
    // Starte den Server auf dem angegebenen Port
    startServer(port);
    // Baue Verbindung zu Datenbank auf
    connectToDatabase(databaseUrl);
    /**
     * Methode zum Starten des Servers (nimmt einen Port als Parameter entgegen)
     */
    function startServer(_port) {
        // Erstelle ein Http.Server-Objekt
        let server = Http.createServer();
        console.log("server starting on port: " + _port);
        // Weise Server an auf eingehende Anfragen auf diesem Port zu warten
        server.listen(_port);
        // Weise den Server an, Ankommende Anfragen mit der handleRequest-Methode zu bearbeiten
        server.addListener("request", handleRequest);
    }
    /**
     * Bearbeite eine eingehende Anfrage
     */
    async function handleRequest(_request, _response) {
        console.log("What's up?");
        // Setze Header Daten der Antwort, also Informationen die dem zu Antwortenden mitteilen, was in der Antwort steht
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            // Hole Anweisungen aus Request
            let url = Url.parse(_request.url, true);
            // Bereite einen String vor, in dem später JSON-Daten gelagert werden sollen
            let jsonString;
            // Wenn die Anfrage an den Endpunkt /get gesendet wurde, sende alle Rakten aus der Datenbank als JSON zurück
            if (url.pathname == "/get") {
                // Hole alle Raketen aus Datenbank als JSON
                jsonString = JSON.stringify(await rockets.find().toArray());
                // Füge JSON mit allen Raketen der Antwort hinzu
                _response.write(jsonString);
                // Wenn die Anfrage an den Endpunkt /add gesendet wurde, wandle Anfrage in JSON um und füge Daten aus Anfrage in Datenbank ein
            }
            else if (url.pathname == "/add") {
                console.log(_request.url);
                // Wandle Anfrage in JSON um
                jsonString = JSON.stringify(url.query);
                // Füge Anfrage als JSON zu Antwort hinzu
                _response.write(jsonString);
                // Speichere die gesendete Rakete (die query der Anfrage) in die MongoDB Collection
                addRocketToDatabase(url.query);
            }
        }
        // Schließe Antwort ab
        _response.end();
    }
    /**
     * Verbindung zur Datenbank aufbauen
     *
     * verbindet sich mit der Datenbank und befüllt das collection-objekt rockets mit Daten aus der Datenbank
     */
    async function connectToDatabase(_url) {
        // Setze Optionen des MongoClienten
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        // Erstelle einen neuen Mongo Client
        let mongoClient = new Mongo.MongoClient(_url, options);
        // Verbinde mit Client zur Datenbank
        await mongoClient.connect();
        // Befülle collection-objekt (rockets) mit Daten aus Datenbank
        rockets = mongoClient.db("Firework").collection("Fireworks");
        // Schreibe in Console, ob Verbindung zur Datenbank erfolgreich war
        console.log("Database connection ", rockets != undefined);
    }
    /**
     * Speichere eine Rakete in der Datenbank
     */
    function addRocketToDatabase(rocket) {
        rockets.insertOne(rocket);
    }
})(firework = exports.firework || (exports.firework = {}));
//# sourceMappingURL=Server.js.map