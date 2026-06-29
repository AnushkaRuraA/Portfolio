import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tech: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    appUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDoc = InferSchemaType<typeof projectSchema>;

export const Project =
  (models.Project as mongoose.Model<ProjectDoc>) ||
  model<ProjectDoc>("Project", projectSchema);
