import User from "../schema/userSchema.js";

export const createUser = async (userDetails) => {
  const user = await User.create(userDetails);
  return user || null
}

export const findUser = async (userDetails) => {
  const user = await User.findOne(userDetails);
  return user
}

export const updateUser = async(id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {new: true})
}