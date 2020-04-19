const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CustomerTransactionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    addedOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const CustomerTransaction = mongoose.model('CustomerTransaction', CustomerTransactionSchema);

module.exports = CustomerTransaction;
