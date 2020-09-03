import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as path from "path";
import fileUpload from "express-fileupload"

import { connectToConfigurMongodb } from "./common-functions/mongo-connect";
import { createAndReturnConfigurRouter } from "./routes/configur-routes";

class ConfigurApp {
    public server: express.Application;
    constructor() {
        this.server = express();
        dotenv.config({
            path: path.resolve(__dirname, "../config/config.env"),
        });
        this.instantiateApplicationInfrastructure();
    }

    public async instantiateApplicationInfrastructure() {
        let result = connectToConfigurMongodb()
            .then(async function (result) {
                // console.log(configurApp)
                await configurApp.instantiateMiddleware();
                configurApp.startExpress();
            })
            .catch(function (error) {
                //TODO: If the promise was rejected, throw the error and terminate.
                console.log(error);
            });
        return;
    }

    public async instantiateMiddleware() {
        let promiseFunction = function (resolve, reject) {
            this.server.use(helmet());
            this.server.use(bodyParser.json());
            this.server.use(fileUpload({
                limits: { fileSize: 50 * 1024 * 1024 },
            }));
            this.server.set('views', __dirname + '/views');
            this.server.engine('html', require('ejs').renderFile);
            this.server.set('view engine', 'ejs');
            let configurRouter = createAndReturnConfigurRouter();
            this.server.use(configurRouter);
            this.server.get("/testServerRoutes", function (req, res) {
                res.send("Server is running correctly.");
            });
            return resolve(0);
        }.bind(this);
        this.createPromise(promiseFunction);
    }

    public async startExpress() {
        this.server.listen(process.env.PORT);
        console.log(
            `Configur Server Started! Listening on port: ${process.env.PORT}`
        );
    }

    public async createPromise(promiseFunction) {
        return new Promise(promiseFunction);
    }
}

let configurApp: ConfigurApp;
function createSingletonApplication() {
    if (!configurApp) {
        console.log("Instantiating Singleton Configur Application");
        configurApp = new ConfigurApp();
        return 0;
    } else {
        return 1;
    }
}

createSingletonApplication();
