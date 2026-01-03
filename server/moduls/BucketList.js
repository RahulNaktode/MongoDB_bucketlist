import {Schema, model} from 'mongoose';

const bucketListSchema = new Schema({
    name: {type: String, requried: true},
    description: {type: String},
    priority: {type: Number, default: 0},
    isComplete: {type: Boolean, default: false}
});

const BucketList = model("BucketList", bucketListSchema);

export default BucketList;