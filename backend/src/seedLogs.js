import mongoose from "mongoose";
import Log from "./models/Log.js";
import { getRandomInt, randomDate, getRandomLevel, getRandomAppName, getRandomDetails } from "./utils/random.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/logger";

async function seedLogs() {
  await mongoose.connect(MONGODB_URI);
  await Log.deleteMany({}); // Clear existing logs

  const logs = [];
  const startDate = new Date('2025-01-01T00:00:00Z');
  const endDate = new Date('2025-07-16T23:59:59Z');

  for (let i = 1; i <= 100; i++) {
    const level = getRandomLevel();
    logs.push({
      AppName: getRandomAppName(),
      LogId: i,
      UserId: getRandomInt(1, 10),
      Log: {
        Level: level,
        TimeStamp: randomDate(startDate, endDate),
        Details: getRandomDetails(level),
      },
    });
  }

  await Log.insertMany(logs);
  console.log("Seeded 100 log entries.");
  await mongoose.disconnect();
}

seedLogs().catch((err) => {
  console.error("Seeding error:", err);
  mongoose.disconnect();
}); 