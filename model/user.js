const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: String,
  email: String,
  phone: {
    type: Number,
  },
  photo: {
    type: String,
  },
  dateNow: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
