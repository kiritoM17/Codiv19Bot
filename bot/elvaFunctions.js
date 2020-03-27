const uuid = require("uuid");
const utilisateur = require("./../repository/Utilisateur.repository");
const utilisateurModel = require("./../models/Utilisateur");
const sendBot = require("./sendMessageFunction");
const sendBotF = new sendBot();
const botOnline = require("./botOnileFunction");
const dialogFlow = new botOnline();
const utilisateurRepository = new utilisateur();
// demmarrer une nouvelle session
global.sessionIds = new Map();
class botFunction {
  constructor() {}

  sauvegarderUser(sender, event) {
    let userM = new utilisateurModel({
      _id: sender,
      first_message: true
    });

    utilisateurRepository.sauvegarderUtilisateur(userM);
    let message = event.message;
    let messageId = message.mid;
    let appId = message.app_id;
    let metadata = message.metadata;
    let recipientID = event.recipient.id;

    // You may get a text or attachment but not both
    let messageText = "que sais tu faire";
    let messageAttachments = message.attachments;
    if (messageText) {
      let helloMessage = [
        `Bonjour,bienvenue je me prèsente, je suis Elva votre Assistant`
      ];
      //sendBotF.Menu(sender);
      sendObjectMessage(sender, helloMessage[0]);
      console.log("la usser M object", userM);
    } else if (messageAttachments) {
      // si le message est autre chose que du texte
      console.log(messageAttachments);
      //handleMessageAttachments(messageAttachments, senderID);
    }
  }
  receivedMessage(event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;
    if (!sessionIds.has(senderID)) {
      sessionIds.set(senderID, uuid.v1());
    }
    let user = utilisateurRepository
      .finByFacebookId(senderID)
      .then(result => {
        if (result == null) {
          this.sauvegarderUser(senderID, event);
        } else {
          let messageId = message.mid;
          let appId = message.app_id;
          let metadata = message.metadata;
          // You may get a text or attachment but not both
          let messageText = message.text;
          let messageAttachments = message.attachments;
          if (messageText) {
            dialogFlow.sendToApiAi(senderID, messageText);
          } else if (messageAttachments) {
            // si le message est autre chose que du texte
            console.log(messageAttachments);
            //handleMessageAttachments(messageAttachments, senderID);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}
module.exports = botFunction;
