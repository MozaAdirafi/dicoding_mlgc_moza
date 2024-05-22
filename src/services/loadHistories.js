const { Firestore } = require('@google-cloud/firestore');

async function loadHistories() {
    const firestore = new Firestore();
    return firestore.collection('predictions').get();
}

module.exports = loadHistories;