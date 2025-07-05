const { generateStreamToken } = require("../lib/stream.js");

module.exports.getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
