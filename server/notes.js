Meteor.publish('notes', function () {
    return Notes.find({});
});

Notes.allow({
    insert: function(userId, doc){
        return false;
    },
    update:  function(userId, doc, fieldNames, modifier){
        return false;
    },
    remove:  function(userId, doc){
        return false;
    }
});