var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ] //you need this to link the comments to the camps
});

module.exports = mongoose.model("Camp", campSchema);//this compiles the schema.
//it also makes a collection called camps based off u putting Camp in there