import express from "express";
import { insertDataIntoCSVCollection, returnDocumentsInCSVCollection } from "../dao/dao-mods/mongo-dao/dao-csv-coll"
import * as fs from "fs";
import csv from "csvtojson";

import { extractCSVData, insertCSVDataIntoCollection, writeCSVDataToTempFile } from "../configur-functionality/configur-csv-func"
import { createCipher } from "crypto";


export function createAndReturnConfigurRouter() {
    let router = express.Router();
    router.use("/csv-upload", insertCSVIntoCollection);
    router.use("/find-csv-documents", returnCSVDocs)
    //Root
    router.use("/", serveHomePage);
    return router;
}

/**
 * Inserts passed in CSV into collection.
 * @param req 
 * @param res 
 */
async function insertCSVIntoCollection(req: express.Request, res: express.Response) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let csvFileData = req.files["configur-csv"];
    try {
        let csvData = extractCSVData(csvFileData);
        await writeCSVDataToTempFile(csvData);
        insertCSVDataIntoCollection(csvData, res);
        return res.status(200).send(`CSV succesfully inserted\n`);
    }
    catch (err) {
        return res.status(500).send(`Internal Server Error\n`);
    }

}

/**
 * Returns CSV documents from collection.
 * @param req 
 * @param res 
 */
async function returnCSVDocs(req: express.Request, res: express.Response) {
    let returnedDocs = await returnDocumentsInCSVCollection();
    return res.status(200).send(returnedDocs);
}

/**
 * Serves home page.
 * @param req 
 * @param res 
 */
function serveHomePage(req: express.Request, res: express.Response) {
    return res.render(`homepage-${process.env.ENV.toLowerCase()}.html`)
}
