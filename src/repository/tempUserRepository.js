import TempUser from "../schema/tempUserSchema.js";

export const createTempUser = async (tempUserDetails) => {
    const tempUser = await TempUser.create(tempUserDetails);
    return tempUser || null
}

export const findTempUser = async (tempUserDetails) => {
    const tempUser = await TempUser.findOne(tempUserDetails);
    return tempUser
}

export const deleteTempUser = async(id) => {
    const tempUser = await TempUser.deleteOne({_id: id});
    return tempUser
}

export const deleteExpiredTempUsers = async() => {
    const result = await TempUser.deleteMany({ expiresAt: { $lt: new Date() }});
    return result.deletedCount;
}

