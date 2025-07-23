import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  AppName: { type: String, required: true },
  LogId: { type: Number, required: true },
  UserId: { type: Number, required: true },
  Log: {
    Level: {
      type: String,
      enum: ["info", "error", "warn", "debug"],
      required: true,
    },
    TimeStamp: { type: Date, required: true },
    Details: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function(v) {
          return typeof v === 'string' || (typeof v === 'object' && v !== null && !Array.isArray(v));
        },
        message: 'Details must be either a string or an object.'
      }
    },
  },
});

const Log = mongoose.model("Log", LogSchema);
export default Log;
