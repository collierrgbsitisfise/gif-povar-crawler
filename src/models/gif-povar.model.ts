import * as mongoose from 'mongoose';

const SchemaM = mongoose.Schema;

const gifPovarSchema = new SchemaM({
  sourceVideo: {
    type: String,
  },
  sourceImg: {
    type: String,
  },
  cookName: {
    type: String,
  },
  LinkToPost: {
    type: String,
  },
  time: {
    type: Number,
    default: new Date()
  }
});

const gifPovar = mongoose.model('gif-povar-cooks', gifPovarSchema);

export default gifPovar;
