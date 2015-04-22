Meteor.autorun(function () {
    Meteor.subscribe('notes');
});

Template.notesList.helpers({
    notes: function () {
        return Notes.find({});
    }
});