import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** Tiny key/value collection, used to remember which seed version was applied. */
const metaSchema = new Schema({ key: { type: String, required: true, unique: true }, value: Schema.Types.Mixed });

export type MetaDoc = InferSchemaType<typeof metaSchema>;
export const Meta: Model<MetaDoc> = (models.Meta as Model<MetaDoc>) || model<MetaDoc>("Meta", metaSchema);
