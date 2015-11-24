Stories = new Meteor.Collection('stories');



Meteor.methods({
	
	storyInsert: function(storyParam) {
       
        //console.log('inserting storyParam: ',storyParam);
       
      
        var storyID = Stories.insert(storyParam);
        //console.log("Inserted a story:",storyID);
        return {
            _id: storyID
        };
    }
});