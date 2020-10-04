const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
    title: {
        type:String,
        required: [true, 'Title is required']

    },

    description:{
        type:String,
        required:[true, 'An event must have a description']
    },
    image:{
        type:String,
        rewuired:[true, 'Event image is required']
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    time:{
        type:String,
        required:true
    },
    location:{
        type: String,
        required:true
    },
    date:{
        type:String,
        required: true
    }
})

const EventModel = mongoose.model('event', EventsSchema);
module.exports = EventModel;