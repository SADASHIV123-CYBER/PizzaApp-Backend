import User from "../schema/userSchema.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import NotFoundError from "../utils/errors/notFoundError.js";

export const createUser = async (userDetails) => {
  const user = await User.create(userDetails);
  if (!user) {
    throw new BadRequestError("User creation failed");
  }
  return user;
};

export const findUser = async (userDetails) => {
  const user = await User.findOne(userDetails);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) {
    throw new NotFoundError(`User not found with id: ${id}`);
  }
  return user;
};
