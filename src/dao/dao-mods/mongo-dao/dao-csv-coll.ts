import { configurCSVModel } from "../mongo-schemas/configur-csv-coll"

export function insertDataIntoCSVCollection(configurCSV) {
    console.log("Executing addUser to database.");
    console.log("Executing createDocument Function!");
    let createDocument = configurCSVModel.create(configurCSV).then(
        function (response) {
            console.log("Resolving createDocument Function");
        }).catch(
            function (err) {
                console.log("CreateDocument - createAndOrRetrieveUser:", err);
            })
    return createDocument;
}

export function returnDocumentsInCSVCollection() {
    return new Promise(function(resolve, reject)
    {
        configurCSVModel.find({}).then(function (response) {
            console.log(response);
            return resolve(response);
        }).catch(function (err) {
            console.log(err);
            return reject(err);
        })
    })
}