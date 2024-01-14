import mongoose, {Schema} from "mongoose";

const enamadSchema = new Schema({
    name: String,
    domain: String,
    location: String,
    expired: String,
    star: Number,
  });

  const Enamad = mongoose.model("Enamad", enamadSchema);
export default Enamad;