const botFunction = require("./../bot/elvaFunctions");
const bot = new botFunction();
const utilisateur = require("./../repository/Utilisateur.repository");
const utilisateurRepository = new utilisateur();

class Elva {
  constructor() {}
  getFacebook(req, res) {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === "subscribe" && token === "aaa237botCodiv") {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }
  postFacebook(req, res) {
    let data = req.body;

    // Make sure this is a page subscription
    if (data.object == "page") {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(pageEntry => {
        let pageID = pageEntry.id;
        let timeOfEvent = pageEntry.time;
        // Iterate over each messaging event
        pageEntry.messaging.forEach(messagingEvent => {
          if (messagingEvent.message) {
            bot.receivedMessage(messagingEvent);
          } else {
            console.log(
              "Webhook received unknown messagingEvent: ",
              messagingEvent
            );
          }
        });
      });
      // Assume all went well.
      // You must send back a 200, within 20 seconds
      res.sendStatus(200);
    }
  }
}

module.exports = Elva;
