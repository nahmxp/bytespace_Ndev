import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    courseSlug: { type: String, required: true },
    /** Zero-based indexes of completed modules. */
    completedModules: { type: [Number], default: [] },
  },
  { timestamps: true },
);
enrollmentSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

export type EnrollmentDoc = InferSchemaType<typeof enrollmentSchema>;
export const Enrollment: Model<EnrollmentDoc> =
  (models.Enrollment as Model<EnrollmentDoc>) || model<EnrollmentDoc>("Enrollment", enrollmentSchema);
