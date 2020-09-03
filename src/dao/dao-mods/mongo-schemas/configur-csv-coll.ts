import { Schema, model } from "mongoose";

const productsSchema: Schema = new Schema(
    {
        "csv": { type: Schema.Types.Mixed, required: true },
        "timestamp": { type: Date, default: Date.now }
    });

export const configurCSVModel = model('configur-csv', productsSchema, "configur-csv");