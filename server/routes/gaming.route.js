const express = require("express");
const {
  createGame,
  listAllGame,
  approveGame,
  listOfPendingGamesAdmin,
  listOfGameForDevelopers,
  deleteGame,
  updateGame,
  countGamePlayedBy,
} = require("../controller/game.controller");
const { protectRoute, authorizeRoles } = require("../middleware/auth");
const {
  deleteReviewAndRating,
  updateReviewAndRating,
  createReviewAndRating,
} = require("../controller/review.controller");

const gameRouter = express.Router();

// applying protect route to all below 
gameRouter.use(protectRoute);

// Game Management Routes 

gameRouter.route("/")
  .post(authorizeRoles(["developer"]), createGame) 
  .get(listAllGame); // Publicly viewable by logged-in users

gameRouter
  .route("/approve/:id")
  .patch(authorizeRoles(["admin"]), approveGame);

gameRouter
  .route("/pending")
  .get(authorizeRoles(["admin"]), listOfPendingGamesAdmin);

gameRouter
  .route("/developerlist")
  .get(authorizeRoles(["developer"]), listOfGameForDevelopers);

// CRUD for specific games
gameRouter.route("/:id")
  .patch(authorizeRoles(["developer"]), updateGame)
  .delete(authorizeRoles(["developer"]), deleteGame);

// Review Routes 
// These are protected by protectRoute added via gameRouter.use above
gameRouter.route("/review").post(createReviewAndRating);

gameRouter
  .route("/review/:id")
  .patch(updateReviewAndRating)
  .delete(deleteReviewAndRating);

// Analytics Routes
gameRouter.route("/playedby").post(countGamePlayedBy);

module.exports = gameRouter;