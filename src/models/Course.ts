import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, index: "text" },
    creator: { type: String, required: true, trim: true },
    creatorSlug: { type: String, required: true, index: true },
    headline: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: [String], default: [] },
    keyPoints: { type: [String], default: [] },
    modules: { type: [{ title: String, summary: String, minutes: Number }], default: [] },
    gallery: { type: [String], default: [] },
    hero: { type: String, default: "" },
    students: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
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
