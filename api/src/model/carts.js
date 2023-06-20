import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;


const cartSchema = mongoose.Schema(
    {
        owner: { type: ObjectID, ref: "Users", required: true },
        item: { type: ObjectID, ref: "Items", required: true },
        quantity: { type: Number, required: true },
        bill: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Cart_model = mongoose.model("Carts", cartSchema);
export default Cart_model;
