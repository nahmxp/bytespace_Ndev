import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    avatar: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;
export const Testimonial: Model<TestimonialDoc> =
  (models.Testimonial as Model<TestimonialDoc>) ||
  model<TestimonialDoc>("Testimonial", testimonialSchema);
