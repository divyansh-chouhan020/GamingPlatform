const gameModel = require("../model/game.model");
const userModel = require("../model/user.model");
const { sendEmail } = require("../utils/utility");
//Create a new game

const createGame = async (req, res) => {
  try {
    console.log("value", req.user);
    const { title, genre, desc } = req.body;
    if (!title || !genre || !desc) {
      return res.status(400).json({
        success: false,
        message: "Fields are missing",
        error: "Bad Request",
      });
    }
    const exsitingGame = await gameModel.findOne({
      title,
    });
    if (exsitingGame) {
      return res.status(400).json({
        success: false,
        message: "Game already Existed",
        error: "Bad Request",
      });
    }
    //to do :avatar upload pending
    // const user = await userModel.findById(req.user).select("role");
    // console.log("role", user);
    // if (user.role != "developer") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "you are not a developer",
    //     error: "Bad Request",
    //   });
    // }
    const game = await gameModel.create({
      title,
      genre,
      desc,
      createdBy: req.user,
      status: "pending",
    });
    return res.status(200).json({
      sucess: true,
      message: "Game Created",
      data: game,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
//List all game
const listAllGame = async (req, res) => {
  try {
    // const { limit = 25, page = 1, genre, status, keyword } = req.query;
    // const skip = (parseInt(page) - 1) * parseInt(limit);
    const { genre, keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const status = "approved";
    // TODO: imlement date filter
    //filter object
    const where = {
      // genre,
      // status,
      title: { $regex: keyword || "", $options: "i" },
      // desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    // if (status) {
    //   where.status = status;
    // }
    where.status = status;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / parseInt(limit));
    console.log("totalPages", totalPages);

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: parseInt(page),
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listAllGame", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const approveGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }
    // const user = await userModel.findById(req.user).select("role");
    // if (user.role != "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to approve the game",
    //     error: "Forbidden",
    //   });
    // }

    const game = await gameModel
      .findByIdAndUpdate(id, { status: "approved" })
      .populate("createdBy", "name email");
    console.log("game", game);
    await sendEmail({
      to: game.createdBy.email,
      subject: "Game Approved Successfully",
      text: `Congratulations ${game.createdBy.name}, Your game "${game.title}" has been approved. Yaaayyyyyyyyy!!!!!1`,
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Game approved successfully",
      data: game,
    });
  } catch (err) {
    console.log("controller@approveGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const listOfPendingGamesAdmin = async (req, res) => {
  try {
    const { genre, keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const status = "pending";
    // TODO: imlement date filter
    //filter object
    const where = {
      title: { $regex: keyword || "", $options: "i" },
      desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    where.status = status;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / limit);
    console.log("totalPages", totalPages);

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: page,
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listOfPendingGamesAdmin", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const listOfGameForDevelopers = async (req, res) => {
  try {
    const { genre, keyword, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // TODO: imlement date filter
    //filter object
    const where = {
      title: { $regex: keyword || "", $options: "i" },
      desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    if (status) {
      where.status = status;
    }
    where.createdBy = req.user;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / limit);
    console.log("totalPages", totalPages);

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: page,
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listOfPendingGamesAdmin", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }

    const game = await gameModel.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    if (game.createdBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this game",
        error: "Forbidden",
      });
    }
    await gameModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Game Deleted",
    });
  } catch (err) {
    console.log("controller@DeleteGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, desc } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }

    const game = await gameModel.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    if (game.createdBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this game",
        error: "Forbidden",
      });
    }
    await gameModel.findByIdAndUpdate(id, { title, genre, desc });
    return res.status(200).json({
      success: true,
      message: "Game Updated",
    });
  } catch (err) {
    console.log("controller@UpdateGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const countGamePlayedBy = async (req, res) => {
  try {
    const { gameId, userId } = req.body;

    if (!gameId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Game ID and User ID are required",
      });
    }

    const game = await gameModel.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // Save who played last
    game.playedBy = userId;

    // Increase play count
    game.totalPlayedBy += 1;

    await game.save();

    return res.status(200).json({
      success: true,
      message: "Play count updated",
      data: game.totalPlayedBy,
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
  createGame,
  listAllGame,
  approveGame,
  listOfPendingGamesAdmin,
  listOfGameForDevelopers,
  deleteGame,
  updateGame,
  countGamePlayedBy,
};
