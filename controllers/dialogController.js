const sendBot = require("./../bot/sendMessageFunction");
const utilisateur = require("./../repository/Utilisateur.repository");
const axios = require("axios");
const utilisateurRepository = new utilisateur();
const sendBotF = new sendBot();
const sms = [
  `Bonjour ! �‍♀,
  Bienvenu sur à vous,
  Je me nomme Elva et je suis à votre service
  il s'agit de notre première conversation
  Aimeriez vous configurer votre profil pour une meilleur Interraction ?`,
  `
  Vous êtes enrégistré comme utilisateur anonymme, aimeriez vous configurer votre profil pour une meilleur Interraction ?
  `
];
class MessageController {
  constructor() {}
  greetingFirst(sender) {
    setTimeout(() => {
      let menu = {
        psid: sender,
        persistent_menu: [
          {
            locale: "default",
            composer_input_disabled: false,
            call_to_actions: [
              {
                type: "postback",
                title: "Talk to an agent",
                payload: "CARE_HELP"
              },
              {
                type: "postback",
                title: "Outfit suggestions",
                payload: "CURATION"
              },
              {
                type: "web_url",
                title: "Shop now",
                url: "https://www.originalcoastclothing.com/",
                webview_height_ratio: "full"
              }
            ]
          }
        ]
      };
      sendBotF.callSendAPI(menu);
    }, 30);
    setTimeout(function() {
      sendBotF.sendTextMessage(sender, sms[0]);
    }, 700);
    let menu = [
      {
        content_type: "text",
        title: "Personnaliser",
        payload: "infos_About_Disease_Start3"
      },
      {
        content_type: "text",
        title: "Annonymme",
        payload: "Consulation_Start2 "
      }
    ];
    setTimeout(function() {
      sendBotF.sendQuickReplay(
        sender,
        menu,
        "Veuillez Choisir votre Type d'utilisateur !"
      );
    }, 3000);
  }
  greeting(sender, response) {
    this.chiffreCorona(sender, "par pays");
    utilisateurRepository
      .finByFacebookId(sender)
      .then(result => {
        if (result.get("prenom") == "" || result.get("nom") == "") {
          setTimeout(function() {
            sendBotF.sendTextMessage(sender, sms[1]);
          }, 700);
          let menu = [
            {
              content_type: "text",
              title: "Personnaliser",
              payload: "infos_About_Disease_Start3"
            },
            {
              content_type: "text",
              title: "Annonymme",
              payload: "Consulation_Start2 "
            }
          ];
          setTimeout(function() {
            sendBotF.sendQuickReplay(
              sender,
              menu,
              "Veuillez Choisir votre Type d'utilisateur !"
            );
          }, 3000);
        } else {
          let sms =
            "Bonjour , " +
            result.get("prenom") +
            " " +
            result.get("nom") +
            " c'est plaissant de te revoir que puis je faire pour toi ?";
          setTimeout(() => sendBotF.sendTextMessage(sender, sms), 300);
          sendBotF.sendQuickMenu(sender);
        }
      })
      .catch(err => console.log(err));
  }
  statistiqueParPays(sender, response) {
    if (response.result.actionIncomplete) {
      console.log("response ici =>", response);
      sendBotF.sendTextMessage(sender, response.result.fulfillment.speech);
    } else {
      let url =
        "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php";
      let headers = {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "12f5a40ab4msh547007fed68c229p125a3ajsn5e990ba4864f"
      };
      let pays = response.result.resolvedQuery.toLowerCase();
      console.log("Pays=>", pays);
      axios
        .get(url, {
          params: { country: pays },
          headers: headers
        })
        .then(result => {
          if (result.data.latest_stat_by_country[0] === undefined) {
            sendBotF.sendTextMessage(
              sender,
              "nom du pays incorrect veuilez saisir:  situation corona"
            );
          } else {
            let {
              country_name,
              total_cases,
              new_cases,
              active_cases,
              total_deaths,
              new_deaths,
              total_recovered,
              record_date
            } = result.data.latest_stat_by_country[0];
            new_cases = new_cases == "" ? 0 : new_cases;
            new_deaths = new_deaths == "" ? 0 : new_deaths;
            let sms =
              "Situation au " +
              country_name +
              "\n" +
              "Total cases:" +
              total_cases +
              "\n" +
              "Total death:" +
              total_deaths +
              "\n" +
              "Total recovered:" +
              total_recovered +
              "\n" +
              "Active Cases:" +
              active_cases +
              "\nNew Cases:" +
              new_cases +
              "\n" +
              "New deaths:" +
              new_deaths +
              "\n" +
              " Updated at:" +
              record_date +
              "\n" +
              "by Rapid API";
            setTimeout(() => {
              sendBotF.sendTextMessage(sender, sms);
            }, 600);
          }
        })
        .catch(err => console.log("Erreur =>", err));
    }
  }
  presentation(sender, response) {
    if (response.result.actionIncomplete) {
      sendBotF.sendTextMessage(sender, response.result.fulfillment.speech);
    } else {
      let userInfo = response.result.fulfillment.messages[0].speech.split(";");
      let updateUser = {
        etat: "personalisation",
        nom: userInfo[0],
        prenom: userInfo[1],
        telephone: userInfo[2],
        email: userInfo[3],
        villeUser: userInfo[4]
      };
      utilisateurRepository.updateUtilisateur(sender, updateUser);
      sendBotF.sendTextMessage(
        sender,
        "Merci vos informations ont bien été enrégistré vous pouvez les repersonnaliser à chaque instant en saisisant Personnalisé"
      );
      sendBotF.sendQuickMenu(sender);
    }
  }
  chiffreCorona(sender, response, pays) {
    switch (response) {
      case "résumé":
        let url =
          "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php";
        let header = {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "12f5a40ab4msh547007fed68c229p125a3ajsn5e990ba4864f"
        };
        axios
          .get(url, { headers: header })
          .then(result => {
            let {
              total_cases,
              total_deaths,
              total_recovered,
              new_cases,
              new_deaths,
              statistic_taken_at
            } = result.data;
            let sms =
              "World Total cases:  " +
              total_cases +
              "\n" +
              "World Total death: " +
              total_deaths +
              "\n" +
              "World Total recovered: " +
              total_recovered +
              "\n" +
              "New Cases: " +
              new_cases +
              "\n" +
              "New deaths: " +
              new_deaths +
              "\n" +
              " Updated at " +
              statistic_taken_at +
              "\n" +
              "by Rapid API";
            setTimeout(() => {
              sendBotF.sendTextMessage(sender, sms);
            }, 600);
          })
          .catch(err => console.log(err));
        break;
      case "par pays":
        break;
      case "par pays en temps réel":
        break;
      default:
    }
  }
}

module.exports = MessageController;
