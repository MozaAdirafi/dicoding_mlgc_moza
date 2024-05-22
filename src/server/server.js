require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

async function startServer() {
    try {
        const server = Hapi.server({
            port: process.env.PORT || 3001,
            host: '0.0.0.0',
            routes: {
                cors: {
                    origin: ['*'], // Allows CORS for all origins
                },
            },
        });

        const model = await loadModel();
        server.app.model = model;
        server.route(routes);

        server.ext('onPreResponse', errorHandler);

        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
}

function errorHandler(request, h) {
    const { response } = request;
    if (response instanceof InputError) {
        return createErrorResponse(h, response.message, response.statusCode);
    }

    if (response.isBoom) {
        return createErrorResponse(h, response.output.payload.message, response.output.statusCode);
    }

    return h.continue;
}

function createErrorResponse(h, message, statusCode) {
    return h.response({
        status: 'fail',
        message,
    }).code(statusCode);
}

startServer();