const axios = require("axios");
class SendMessage {
  constructor() {}
  //function d'envoie résultat au serveur
  async callSendAPI(messageData, recipientId, messageId) {
    const url =
      "https://graph.facebook.com/v3.0/me/messages?access_token=" +
      "EAAJUYWCOXUwBAIkdynUZBVi9v8kGkPxTwR26lDgOQCvZBlGyUV9xTXPrD082ZBSudgOBpbsrUrwv0igxepZCk62a7Yoi9GVbZALTwWB30d8Tu7yboHakOJIhNizQZALrQo5N028tT9y9Y708Vxja3KZA9Gfop4uHJuPdAjTBDC4vgZDZD";
    await axios
      .post(url, messageData)
      .then(response => {
        if (response.status == 200) {
          var recipientId = response.data.recipient_id;
          var messageId = response.data.message_id;
          if (messageId) {
            console.log(
              "Successfully sent message with id %s to recipient %s",
              messageId,
              recipientId
            );
          } else {
            console.log(
              "Successfully called Send API for recipient %s",
              recipientId
            );
          }
        }
      })
      .catch(function(error) {
        console.log(error.response.headers);
      });
  }
  //function d'envoie d'un message Text
  async sendTextMessage(recipientId, text) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text
      }
    };
    await this.callSendAPI(messageData);
  }
  //   function pour afficher le menu
  Menu(recipientId) {
    var menu = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Qu'est ce que vous aimeriez connaitre ?",
            buttons: [
              {
                type: "postback",
                title: "Information A propos du Codiv-19",
                payload: "infos_About_Disease_Start3"
              },
              {
                type: "postback",
                title: "Consultation",
                payload: "Consulation_Start2 "
              },
              {
                type: "postback",
                title: "Clinics Around",
                payload: "Clinics_Around_Start3"
              },
              {
                type: "postback",
                title: "Contact Doctors",
                payload: "Contact_Doctor_Start 4"
              },
              {
                type: "postback",
                title: "Emergency Number",
                payload: "Emergency_Number_Start5"
              }
            ]
          }
        }
      }
    };
    this.callSendAPI(menu);
  }
  //function pour les reponses rapides
  sendQuickReplay(recipientId, tabJson, title) {
    var msg = {
      recipient: {
        id: recipientId
      },
      message: {
        text: title,
        quick_replies: tabJson
      }
    };

    this.callSendAPI(msg);
  }

  //function d'envoie message particulier
  sendObject(recipientId, message) {
    var msg = {
      recipient: {
        id: recipientId
      },
      message: message
    };

    this.callSendAPI(msg);
  }
}

module.exports = SendMessage;
