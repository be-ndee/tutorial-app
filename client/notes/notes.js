Session.set('notesFilterText', '');

Meteor.autorun(function () {
    Meteor.subscribe('notes', Session.get('notesFilterText'));
});

// helpers
Template.notesList.helpers({
    notes: function () {
        return Notes.find({});
    }
});

// events
Template.notesCreateForm.events({
    'submit form[name=createNote]': function (event) {
        var text = event.target.noteText.value;
        event.target.noteText.value = '';
        Notes.insert({
            text: text,
            date: new Date()
        });
        return false;
    }
});

Template.notesList.events({
    'click button.deleteNote': function (event) {
        Notes.remove(this._id);
    }
});

Template.notesFilter.events({
    'keyup form[name=filterNotes]': function (event) {
        var text = event.target.value;
        Session.set('notesFilterText', text);
        return false;
    }
});