import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, index: "text" },
    creator: { type: String, required: true, trim: true },
    categories: { type: [String], default: [], index: true },
    image: { type: String, required: true },
    lessons: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    comments: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    price: { type: Number, required: true, min: 0 },
    enrolled: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type CourseDoc = InferSchemaType<typeof courseSchema>;
export const Course: Model<CourseDoc> =
  (models.Course as Model<CourseDoc>) || model<CourseDoc>("Course", courseSchema);
