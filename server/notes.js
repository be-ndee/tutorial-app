Meteor.publish('notes', function (text) {
    return Notes.find({
        $or: [
            {text: { $regex: text }}
        ]
    });
});

Notes.allow({
    insert: function(userId, doc){
        return (
            typeof doc.text === 'string' &&
            doc.date instanceof Date &&
            doc.text.length > 5
        );
    },
    update:  function(userId, doc, fieldNames, modifier){
        return false;
    },
    remove:  function(userId, doc){
        return true;
    }
});