const jwt = require("jsonwebtoken");

async function checkFirst(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "Users are not permitted to create or delete events.",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function checkRegister(req,res,next){
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist" && decoded.role !== "user") {
      return res.status(403).json({
        message: "Not a valid user",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports={checkFirst,checkRegister};
