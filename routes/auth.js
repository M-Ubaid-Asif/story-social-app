const express = require("express");
const router = express.Router();
const passport = require("passport");
//  Auth with google
// GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// google auth callback
// GET /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res, next) => {
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
