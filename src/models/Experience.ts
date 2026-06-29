import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    period: { type: String, default: "" },
    bullets: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ExperienceDoc = InferSchemaType<typeof experienceSchema>;

export const Experience =
  (models.Experience as mongoose.Model<ExperienceDoc>) ||
  model<ExperienceDoc>("Experience", experienceSchema);
