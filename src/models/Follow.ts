import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const followSchema = new Schema(
  {
    userId: { type: String, required: true },
    creatorSlug: { type: String, required: true, index: true },
  },
  { timestamps: true },
);
followSchema.index({ userId: 1, creatorSlug: 1 }, { unique: true });

export type FollowDoc = InferSchemaType<typeof followSchema>;
export const Follow: Model<FollowDoc> = (models.Follow as Model<FollowDoc>) || model<FollowDoc>("Follow", followSchema);
