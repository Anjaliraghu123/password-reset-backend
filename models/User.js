import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // 🔐 Password reset fields
    resetToken: {
      type: String
    },

    resetTokenExpiry: {
      type: Date
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

// create model
const User = mongoose.model("User", userSchema);

// export (IMPORTANT for ES Modules)
export default User;