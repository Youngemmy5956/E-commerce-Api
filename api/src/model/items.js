import mongoose from "mongoose";


const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category:{ type: String, required: true },
    price: { type: Number, required: true },
});


const Item_model = mongoose.model("Items", itemSchema);

export default Item_model;



