const { getPlogDB } = require("../../config/conectet");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const friendshipSchema = new Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index to prevent duplicate requests and allow quick lookups
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ recipient: 1, status: 1 });

let FriendshipModel;
const getFriendshipModel = () => {
  if (FriendshipModel) return FriendshipModel;
  const db = getPlogDB();
  FriendshipModel = db.model("Friendship", friendshipSchema);
  return FriendshipModel;
};

module.exports = { getFriendshipModel };
