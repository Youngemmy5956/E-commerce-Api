import mongoose from "mongoose";


const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category:{ type: String, required: true },
    price: { type: Number, required: true },
});


const Item_model = mongoose.model("Items", itemSchema);

export default Item_model;


// import mongoose from "mongoose";
// const ObjectID = mongoose.Schema.Types.ObjectId;

// const userSchema = mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },

// });

// const itemSchema = mongoose.Schema(
//   {
    // owner: { type: ObjectID, ref: "Users", required: true },
//     description: { type: String, required: true },
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Item_model = mongoose.model("Items",  userSchema);

// export default Item_model;
