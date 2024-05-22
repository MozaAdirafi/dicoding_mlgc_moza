const { postPredictionHandler, getPredictionHistoriesHandler } = require("./handler");

function createRoute(path, method, handler, options = {}) {
    return { path, method, handler, options };
}

const routes = [
    createRoute('/predict', 'POST', postPredictionHandler, {
        payload: {
            allow: 'multipart/form-data',
            multipart: true,
            maxBytes: 1000000,
        },
    }),
    createRoute('/predict/histories', 'GET', getPredictionHistoriesHandler),
];

module.exports = routes;
