Meteor.publish('notes', function () {
    return Notes.find({});
});

Notes.allow({
    insert: function(userId, doc){
        return (
            typeof doc.text !== 'undefined' &&
            typeof doc.date !== 'undefined' &&
            doc.text.length > 5
        );
    },
    update:  function(userId, doc, fieldNames, modifier){
        return false;
    },
    remove:  function(userId, doc){
        return false;
    }
});