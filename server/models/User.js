import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define a schema for the user model

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        // Custom validator for email format
        validator: function (str) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Object,
      default: {
        total: 0,
        count: 0,
      },
    },

    notifications: {
      type: Array,
      default: [],
    },

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    minimize: false,
  }
);

// Define a static method to find an user by email and password

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid User");
  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (!isSamePassword) throw new Error("Invalid Password");
  return user;
};

// Define an instance method to remove the password field from the user object

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// Middleware to hash the password before saving the user

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) return next(error);
    user.password = hash;
    next();
  });
});

// Middleware to remover user's orders before removing the user

UserSchema.pre("remove", function (next) {
  this.model("Order").remove({ owner: this._id }, next);
});

const User = mongoose.model("User", UserSchema);

export default User;
