import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const subscriberSchema = new Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true },
);

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>;
export const Subscriber: Model<SubscriberDoc> =
  (models.Subscriber as Model<SubscriberDoc>) ||
  model<SubscriberDoc>("Subscriber", subscriberSchema);
