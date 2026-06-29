import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const skillSchema = new Schema(
  {
    category: { type: String, required: true },
    items: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SkillDoc = InferSchemaType<typeof skillSchema>;

export const Skill =
  (models.Skill as mongoose.Model<SkillDoc>) ||
  model<SkillDoc>("Skill", skillSchema);
