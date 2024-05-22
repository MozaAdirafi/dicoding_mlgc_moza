const crypto = require('crypto');
const storeData = require('../services/storeData');
const predictionClassification = require('../services/inferenceService');
const loadHistories = require('../services/loadHistories');

const createSuccessResponse = (h, data, message = 'Request successful', statusCode = 200) => {
    return h.response({
        status: 'success',
        message,
        data
    }).code(statusCode);
};

const createErrorResponse = (h, message, statusCode = 400) => {
    return h.response({
        status: 'fail',
        message
    }).code(statusCode);
};

async function postPredictionHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const prediction = await predictionClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: prediction.label,
            suggestion: prediction.suggestion,
            createdAt,
        };

        await storeData(id, data);

        return createSuccessResponse(h, data, 'Model is predicted successfully', 201);

    } catch (error) {
        return createErrorResponse(h, 'Terjadi kesalahan dalam melakukan prediksi');
    }
}

async function getPredictionHistoriesHandler(request, h) {
    try {
        const loadedHistories = await loadHistories(); 
        const result = []; 

        
        loadedHistories.forEach(history => {
            const formattedHistory = {
                id: history.id,        
                history: history.data() 
            };
            result.push(formattedHistory);  
        });

        return h.response({
            status: 'success',
            data: result
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan dalam melakukan pengambilan Histories',
            error: error.message
        }).code(400);
    }
}

module.exports = { postPredictionHandler, getPredictionHistoriesHandler };
