const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictionClassification(model, image) {
    try {
        const tensor = preprocessImage(image);
        const prediction = model.predict(tensor);
        const scores = await prediction.data();
        
        return interpretScores(scores);
    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

function preprocessImage(image) {
    return tf.node.decodeJpeg(image)
                 .resizeNearestNeighbor([224, 224])
                 .expandDims()
                 .toFloat();
}

function interpretScores(scores) {
    const threshold = 0.5;
    const label = scores > threshold ? 'Cancer' : 'Non-cancer';
    const suggestion = scores > threshold ? 'Kanker terdeteksi' : 'Kanker tidak terdeteksi';

    return { label, suggestion };
}

module.exports = predictionClassification;
