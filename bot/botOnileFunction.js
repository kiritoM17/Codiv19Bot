const apiai = require("apiai");
const sendBot = require("./sendMessageFunction");

const dialog = require("./../controllers/dialogController");
const dialogController = new dialog();
const sendBotF = new sendBot();

const apiAiService = apiai("3f889cb8a99f48a8a319df175f8d1cff", {
  language: "fr",
  requestSource: "fb"
});
// const sessionIds = new Map();
class DialogFlow {
  constructor() {}
  sendToApiAi(sender, text) {
    this.sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
      sessionId: sessionIds.get(sender)
    });
    apiaiRequest.on("response", response => {
      if (this.isDefined(response.result)) {
        console.log("APIA response from DialogFlow", response);
        this.handleApiAiResponse(sender, response);
      }
    });
    apiaiRequest.on("error", error => console.error(error));
    apiaiRequest.end();
  }
  sendTypingOn = recipientId => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    sendBotF.callSendAPI(messageData);
  };
  isDefined(obj) {
    if (typeof obj == "undefined") {
      return false;
    }
    if (!obj) {
      return false;
    }
    return obj != null;
  }
  handleApiAiResponse(sender, response) {
    console.log(
      `les meta data le iten name on va jouer dessus ${response.result.metadata.intentName}`
    );
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;
    let itentName = response.result.metadata.itentName;
    this.sendTypingOff(sender);
    if (response.result.metadata.intentName === "présentation") {
      dialogController.presentation(sender, response);
    } else if (
      response.result.metadata.intentName === "salutation" ||
      response.result.metadata.intentName === "Default Welcome Intent"
    ) {
      dialogController.greeting(sender, response);
    } else if (response.result.metadata.intentName === "statistique pays") {
      dialogController.statistiqueParPays(sender, response);
    } else if (
      response.result.metadata.intentName == "Default Fallback Intent" &&
      response.result.resolvedQuery == "Annonymme"
    ) {
      sendBotF.sendQuickMenu(sender);
    } else {
      if (responseText === "" && !this.isDefined(action)) {
        //api ai could not evaluate input.
        console.log("Unknown query" + response.result.resolvedQuery);
        sendBotF.sendTextMessage(
          sender,
          "I’m not sure what you want. Can you be more specific?"
        );
      } else if (this.isDefined(action)) {
        handleApiAiAction(sender, action, responseText, contexts, parameters);
      } else if (
        this.isDefined(responseData) &&
        this.isDefined(responseData.facebook)
      ) {
        try {
          console.log("Response as formatted message" + responseData.facebook);
          sendBotF.sendTextMessage(sender, responseData.facebook);
        } catch (err) {
          sendBotF.sendTextMessage(sender, err.message);
        }
      } else if (this.isDefined(responseText)) {
        sendBotF.sendTextMessage(sender, responseText);
      }
    }
  }
  sendTypingOff(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_off"
    };
  }
}
const handleApiAiAction = (
  sender,
  action,
  responseText,
  contexts,
  parameters
) => {
  switch (action) {
    case "send-text":
      var responseText = "This is example of Text message.";
      sendTextMessage(sender, responseText);
      break;
    default:
      //unhandled action, just send back the text
      sendBotF.sendTextMessage(sender, responseText);
  }
};
module.exports = DialogFlow;
