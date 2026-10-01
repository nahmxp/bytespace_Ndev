import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const creatorSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    headline: { type: String, default: "" },
    bio: { type: [String], default: [] },
    avatar: { type: String, required: true },
    /** Baseline followers; real follows from users are added on top. */
    followers: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type CreatorDoc = InferSchemaType<typeof creatorSchema>;
export const Creator: Model<CreatorDoc> =
  (models.Creator as Model<CreatorDoc>) || model<CreatorDoc>("Creator", creatorSchema);
