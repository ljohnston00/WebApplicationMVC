const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {type: String, required: [true, 'category is required'], enum: ['connecting', 'sports', 'cuisine', 'astronomy', 'other']},
    title: {type: String, required: [true, 'title is required']},
    content: {type: String, required: [true, 'content is requird'], minLength: [10, 'content should atleast be 10 characters']},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    start: {type: Date, required: [true, 'start date is required']},
    end: {type: Date, required: [true, 'end date is required']},
    image: {type: String, required: [true, 'image is required']},
    location: {type: String, required: [true, 'location is required']}
},
{timestamps: true}
);

module.exports = mongoose.model('Event', eventSchema);