const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: String,
    recipient: String,
    confession: String,
    passkey: String,
    clue: String,
});

module.exports = mongoose.model("Card", cardSchema);