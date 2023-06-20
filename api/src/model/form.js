import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

});

const Form_model = mongoose.model("Forms", userSchema);

export default Form_model;