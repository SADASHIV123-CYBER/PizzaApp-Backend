import User from "../schema/userSchema.js";

export const createUser = async (userDetails) => {
  const user = await User.create(userDetails);
  if(!user) {
    throw new Error("User creation failed");
  }
  return user || null
}

export const findUser = async (userDetails) => {
  const user = await User.findOne(userDetails);
  if(!user) {
    throw new Error("User not found");
  }
  return user
}

export const updateUser = async(id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {new: true});

  if(!user) {
    throw new Error("User not found");
  }
}