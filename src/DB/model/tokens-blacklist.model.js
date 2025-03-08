import mongoose from "mongoose";

const TokenBlacklistSchema = new mongoose.Schema({
  tokenId: { type: String, required: true }, // token id
  exp: { type: Date, required: true }, // token expiry time
});

const TokenBlacklist = mongoose.models.TokensBlacklist || mongoose.model("TokensBlacklist", TokenBlacklistSchema);

export {TokenBlacklist};