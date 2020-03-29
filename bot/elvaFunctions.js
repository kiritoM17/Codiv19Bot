const uuid = require("uuid");
const utilisateur = require("./../repository/Utilisateur.repository");
const utilisateurModel = require("./../models/Utilisateur");
const dialogController = require("./../controllers/dialogController");
const dialogC = new dialogController();
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
      etat: "start",
      nom: "",
      prenom: "",
      sexe: "",
      telephone: "",
      email: "",
      localisation: {
        latUser: "",
        lonUser: ""
      },
      villeUser: ""
    });
    dialogC.greetingFirst(sender);
    utilisateurRepository.sauvegarderUtilisateur(userM);
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
