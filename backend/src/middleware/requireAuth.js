import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

 
  if (!authorization) {
    return res.status(401).json({ error: "Je moet ingelogd zijn" });
  }


  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(userId).select("_id email");

   
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token is niet geldig" });
  }
};
