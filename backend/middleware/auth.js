import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");

    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default auth;