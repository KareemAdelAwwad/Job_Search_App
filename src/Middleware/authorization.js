import { Roles } from "../Constants/index.js";
import { User } from "../DB/index.js";

export const authorization = (role) => async (req, res, next) => {
  try {
    // check role
    if (!role) {
      return next();
    };
    if (!Object.values(Roles).includes(role)) {
      return res.status(400).json({ message: "❗ Invalid Role!" });
    };
    const { _id } = req.user;
    const user = await User.findById(_id);
    // check if the user is authorized
    if (user.role !== role) {
      return res.status(403).json({ message: "🔑 Forbidden" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "🔒 Unauthorized" });
  }
};