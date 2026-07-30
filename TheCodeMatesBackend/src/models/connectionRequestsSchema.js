import mongoose from "mongoose";

const connectionRequestsSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    status: {
      type: String,
      required: true,
      // enum: we create an enum when we want to restrict the user for some values.
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        // Now it will automatically catch the "VALUE" and if its incorrect it will throw an error with the incorrect value.
        message: "{VALUE} is incorrect.",
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestsSchema.pre("save", async function (next) {
  // as 2 objects can never be equal we have to call equals method on the 1st object to check if its equal to the 2nd object.
  if (this.senderId.equals(this.receiverId)) {
    throw new Error("The Sender and Receiver ID cannot be same.");
  }

  // As this works like a middleware we have to call next() function here, and we will receive the next function as a param to the callback function.
  // next();
});

//In Mongoose, hook completion is signaled one of two ways depending on version: calling a next() callback, or returning a Promise (typically via async/await). On older Mongoose (≤8), both are supported, but only when used correctly — declaring a hook plain function(next) gives you a real next to call; declaring it async means Mongoose expects the returned promise to signal completion instead, so next isn't guaranteed to work the same way. On Mongoose 9+, next was removed entirely — hooks must be async (or return a Promise), and calling next at all will fail since it's simply not provided anymore. The safest approach: pick one style consistently — callback-based (next()/next(err)) on older versions, or async-based (throw/return) — and check your installed Mongoose version if you're unsure which applies.

connectionRequestsSchema.index({
  senderId: 1, // 1 means ascending and -1 means descending
  receiverId: 1,
});
export const ConnectionRequestsModel = mongoose.model("ConnectionRequestsModel", connectionRequestsSchema);
