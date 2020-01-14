"use strict"

// Require modules.
const swaggerTools = require("swagger-tools");
const yamlParser = require("js-yaml");

const fs = require("fs");
const cors = require("cors");
const http = require("http");

// Create a web service reference.
const connect = require("connect");
const service = connect();

// Read swagger doc and load it to a js object.
let spec = fs.readFileSync("./api/swagger.yaml", "utf8");
let swaggerDoc = yamlParser.safeLoad(spec);

// Initialize swagger middlewares.
swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    service.use(cors({
        origin: '*',
        allowMethods: ['GET'],
        exposeHeaders: ['X-Request-Id']
    }));

    // Configure swagger middlewares for exposing metadata and validations.
    service.use(middleware.swaggerMetadata());
    service.use(middleware.swaggerValidator());

    // Configure swagger router - this handles the routings specified in the swagger.yaml.
    let options = {
        swaggerUi: "/swagger.json",
        controllers: "./controllers"
    };
    service.use(middleware.swaggerRouter(options));

    // Configure swagger UI.
    service.use(middleware.swaggerUi({
        apiDocs: "/locker/api-docs",
        swaggerUi: `/locker/swagger`
    }));

    // Create http listener and run it on port.
    http.createServer(service).listen(8018);
});
