import mongoose from "mongoose";

export const roleEnum = {
  user: "user",
  admin: "admin",
};
export const genderEnum = {
  male: "male",
  female: "female",
};
export const providerEnum = {
  google: "google",
  system: "system",
};
Object.freeze(roleEnum);
Object.freeze(genderEnum);
Object.freeze(providerEnum);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.provider === providerEnum.system) {
          return true;
        }
        return false;
      },
      minLength: 2,
    },
    phone: {
      type: String,
    },
    confirmEmail: {
      type: Date,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.male,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.user,
    },
    confirmEmailOtp: {
      type: String,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },
    confirmEmailOtpExpires: {
      type: Date,
    },
    confirmEmailOtpAttempts: {
      type: Number,
      default: 0,
    },
    confirmEmailOtpBan: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restoredAt: {
      type: Date,
    },
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    optimisticConcurrency: true,
  }
);

userSchema
  .virtual("fullName")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
