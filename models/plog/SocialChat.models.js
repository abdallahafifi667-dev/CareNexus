const { getChatDB } = require("../../config/conectet");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const socialChatSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "audio", "video"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Indexes for fast retrieval
socialChatSchema.index({ from: 1, to: 1, createdAt: -1 });
socialChatSchema.index({ to: 1, isRead: 1 });

let SocialChatModel;
const getSocialChatModel = () => {
  if (SocialChatModel) return SocialChatModel;
  const db = getChatDB();
  SocialChatModel = db.model("SocialChat", socialChatSchema);
  return SocialChatModel;
};

module.exports = { getSocialChatModel };
