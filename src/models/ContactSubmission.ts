import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

const contactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ContactSubmissionDoc = InferSchemaType<
  typeof contactSubmissionSchema
>;

export const ContactSubmission =
  (models.ContactSubmission as mongoose.Model<ContactSubmissionDoc>) ||
  model<ContactSubmissionDoc>("ContactSubmission", contactSubmissionSchema);
