const reviewAndRatingModel = require("../model/review.rating.model");
const gameModel = require("../model/game.model");
const createReviewAndRating = async (req, res) => {
  try {
    const { rating, review, gameId } = req.body;
    if (!rating || !gameId || !review) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        error: "Bad Request",
      });
    }
    const exsitingReview = await reviewAndRatingModel.findOne({
      ratedBy: req.user,
      game: gameId, 
    });
    if (exsitingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this game",
        error: "Bad Request",
      });
    }
    const newReview = await reviewAndRatingModel.create({
      rating,
      review,
      ratedBy: req.user,
      game: gameId,
    });
    const gameReviews = await reviewAndRatingModel.find({ game: gameId });
    let totalRatings = 0;
    gameReviews.forEach((item) => {
      totalRatings += item.rating;
    });
    const averageRating = totalRatings / gameReviews.length;

    await gameModel.findByIdAndUpdate(gameId, {
      averageRating: averageRating,
      totalReviews: gameReviews.length,
    });

    return res.status(200).json({
      success: true,
      message: "Review and Rating created successfully",
      data: newReview,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const updateReviewAndRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, gameId } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id is missing",
        error: "Bad Request",
      });
    }
    if (!rating || !gameId || !review) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        error: "Bad Request",
      });
    }

    const updateReview = await reviewAndRatingModel.findById(id);
    if (!updateReview) {
      return res.status(404).json({
        success: false,
        message: "Review Not Found",
        error: "404 not found",
      });
    }
    if (updateReview.ratedBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update",
        error: "Forbidden",
      });
    }
    await reviewAndRatingModel.findByIdAndUpdate(id, { rating, review });
    const gameReviews = await reviewAndRatingModel.find({ game: gameId });
    let totalRatings = 0;
    gameReviews.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / gameReviews.length;

    await gameModel.findByIdAndUpdate(gameId, {
      averageRating: averageRating,
      totalReviews: gameReviews.length,
    });
    

    return res.status(200).json({
      success: true,
      message: "Review and Rating created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const deleteReviewAndRating = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id is missing",
        error: "Bad Request",
      });
    }

    const deleteReview = await reviewAndRatingModel.findById(id);
    if (!deleteReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error: "Not Found",
      });
    }
    if (deleteReview.ratedBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
        error: "Forbidden",
      });
    }
    await reviewAndRatingModel.findByIdAndDelete(id);
    const gameReviews = await reviewAndRatingModel.find({ game: deleteReview.game });
    let totalRatings = 0;
    gameReviews.forEach((review) => {
      totalRatings += review.rating;
    });
    const averageRating = totalRatings / gameReviews.length;

    await gameModel.findByIdAndUpdate(deleteReview.game, {
      averageRating: averageRating,
      totalReviews: gameReviews.length,
    });

    return res.status(200).json({
      success: true,
      message: "Review and Rating created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
module.exports = {
  createReviewAndRating,
  updateReviewAndRating,
  deleteReviewAndRating,
};
