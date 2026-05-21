const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected ✅");
  process.exit(0);
})
.catch(err => {
  console.error("MongoDB Connection Error ❌", err);
  process.exit(1);
});