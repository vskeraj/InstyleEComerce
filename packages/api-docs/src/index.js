"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.specs = void 0;
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
exports.swaggerUi = swagger_ui_express_1.default;
var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'InstyleEComerce API',
            version: '1.0.0',
            description: 'E-commerce microservices API documentation',
            contact: {
                name: 'API Support',
                email: 'support@instyle.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8003',
                description: 'Auth Service'
            },
            {
                url: 'http://localhost:8001',
                description: 'Orders Service'
            },
            {
                url: 'http://localhost:8002',
                description: 'Product Service'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/index.ts']
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
