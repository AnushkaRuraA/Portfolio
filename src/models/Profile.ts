import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const profileSchema = new Schema(
  {
    // Singleton document — there is only ever one profile.
    name: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    about: { type: String, default: "" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    social: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type ProfileDoc = InferSchemaType<typeof profileSchema>;

export const Profile =
  (models.Profile as mongoose.Model<ProfileDoc>) ||
  model<ProfileDoc>("Profile", profileSchema);
