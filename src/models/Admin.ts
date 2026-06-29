import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    // Always a bcrypt hash — never plaintext.
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof adminSchema>;

export const Admin =
  (models.Admin as mongoose.Model<AdminDoc>) ||
  model<AdminDoc>("Admin", adminSchema);
