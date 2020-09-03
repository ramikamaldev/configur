import * as fs from "fs";
import { insertDataIntoCSVCollection } from "../dao/dao-mods/mongo-dao/dao-csv-coll"
import * as xlsx from "xlsx"
import { createAndReturnPromise } from "../common-functions/utility-functions"

export function extractCSVData(csvFileData) {
    const csvData = {
        fieldname: 'file',
        originalname: csvFileData["name"],
        encoding: csvFileData["encoding"],
        mimetype: csvFileData["mimetype"],
        buffer: csvFileData["data"],
        size: csvFileData["size"]
    };
    return csvData;
}

export function writeCSVDataToTempFile(csvData) {
    let writeFileFunction = function (resolve, reject) {
        const bufferedData = Buffer.from(csvData.buffer);
        if (!fs.existsSync(__dirname + `../../../tmp/`)) {
            fs.mkdirSync(__dirname + `../../../tmp/`);
        }
        fs.writeFile(__dirname + `../../../tmp/${csvData.originalname}`, bufferedData, function (err) {
            if (err) {
                reject(console.log("dirname" + err));
            }
            resolve(console.log("The file was saved!"));
        });
    }
    createAndReturnPromise(writeFileFunction);
}

export function insertCSVDataIntoCollection(filename, csvData, res) {

    const bufferedData = Buffer.from(csvData.buffer);
    try {
        let xlsxFile = xlsx.read(bufferedData);
        const sheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]];
        const parsedData = xlsx.utils.sheet_to_json(sheet, { raw: true });
        insertDataIntoCSVCollection(filename, { csv: parsedData });
    }
    catch (err) {
        console.log(err);
        console.log("The file was saved!");
    }
    finally {
        fs.unlink(__dirname + `../../../tmp/${csvData.originalname}`, function (err) {
            if (err) {
                throw err;
            }
        });
    }
}