const userModel = require("../model/user.model");
const getUser = async (req, res) => {
  try { 
   
     const user = await userModel
      .findById(req.user)
      .select("name email age")
       if (!user) {
      return res.status(404).json({
        success:false, 
        message: "User not found" ,
        error:"Not Found"
      });
    }

     return res.status(200).json({
      success: true,
      data:user
    });

  } catch (err) {
    console.log("controller@getUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    // if (!id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User id is missing",
    //     error: "Bad Request",
    //   });
    // }

    const user = await userModel.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }

    await userModel.findByIdAndUpdate(req.user, { name, email, age, password });
    return res.status(200).json({
      success: true,
      message: "User Updated",
    });
  } catch (err) {
    console.log("controller@UpdateUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
module.exports = {
  updateUser,getUser
};
