const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://test:sparta@cluster0.dcgxcrg.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error", err);
});

module.exports = connect;
