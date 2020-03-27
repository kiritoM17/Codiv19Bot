var express = require("express");
const { Wit, interactive } = require("node-wit");

var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  // const client = new Wit({
  //   accessToken: "UBHVYEEV45NMRBSO7CQCKBMZYJM2ZYUO"
  // });
  // client
  //   .message("comment te nomme tu?")
  //   .then(data => {
  //     // console.log(data.entities);
  //     // if (
  //     //   data.entities.intent[0].value === "salutation" &&
  //     //   data.entities.presentation !== undefined
  //     // ) {
  //     //   let reponse = `bonjour,
  //     //   je me nomme Nursy, Je suis votre amis durant cette période de confinement
  //     //   `;
  //     //   res.render("index", { title: JSON.stringify(data) });
  //     // }
      res.render("index", { title: 'titre' });
  //   })
  //   .catch(err => console.log(err));
  // console.log(interactive(client));
  // interactive(client);
});
module.exports = router;
