import cron from "node-cron";
import TempUser from "../schema/tempUserSchema.js";

export const clearExpiredTempUsers = () => {
  // Runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    const result = await TempUser.deleteMany({ otpExpires: { $lt: new Date() } });
    if (result.deletedCount > 0) {
      console.log(` Deleted ${result.deletedCount} expired temp users`);
    }
  });
};
