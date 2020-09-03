import { Schema, model } from "mongoose";

const productsSchema: Schema = new Schema(
    {
        "name": { type: String, required: true },               
        "csv": { type: Schema.Types.Mixed, required: true },
        "timestamp": { type: Date, default: Date.now }
    });

export const configurCSVModel = model('configur-csv', productsSchema, "configur-csv");