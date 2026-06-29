import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const educationSchema = new Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, default: "" },
    period: { type: String, default: "" },
    detail: { type: String, default: "" },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type EducationDoc = InferSchemaType<typeof educationSchema>;

export const Education =
  (models.Education as mongoose.Model<EducationDoc>) ||
  model<EducationDoc>("Education", educationSchema);
