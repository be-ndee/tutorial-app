# Tutorial

Create a new app called 'tutorial-app' and start the server.

```
 $ meteor create tutorial-app
 $ cd tutorial-app/
 $ meteor
```

## Create file structure

Delete the three basie files tutorial-app.css, tutorial-app.html, tutorial-app.js and create the four directories: client/, collections/, public/ and server/.

## Remove and add packages

Remove the autopublish package, which is used as default, but makes the app insecure, because everyone can edit data. Then add the bootstrap package, to use twitters css-framework bootstrap.

```
 $ meteor remove autopublish
 $ meteor add twbs:bootstrap
```

## Create the collection

To store and handle data we use a collection. To create one you have to write this JS line somewhere in your files. We put it into the 'collectios/' folder. And for each collection we create a new file, with the name of it. So create a file called 'Notes.js' and add this line into it:

```
Notes = new Mongo.Collection('notes');
```

## Publish and allow

That we can insert data from the client via the publish-subscribe pattern, we have to publish the collection on the server. Let's create a file called 'notes.js' inside 'server/' and add this lines into it:

```
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
}
```

The publish-method is used to publish all notes to all subscribers. They can use the parameter 'text' to filter the notes with keywords or -sentences. The allow-method specifies who can insert, update and remove notes from the collection. In this app a note needs a text longer then 5 letters and a date to be inserted. Updating is not allowed and removing for anybody.

## Layout

To create a layout for all pages, we will create a subdirectory 'global/' inside 'client/' and there add the files 'body.html' and 'head.html'. The content looks like this:

*head:*

```
<head>
    <title>Notes App</title>
</head>
```

*body:*

```
<body>
    <div class="container">
        <div class="page-header">
            <h1>Notes App</h1>
        </div>
        {{> notesFilter }}
        {{> notesList }}
        {{> notesCreateForm }}
    </div>
</body>
```

The parts ```{{> template-name }}``` include templates with the 'template-name' into this part. So Here we use templates which are called 'notesFilter', 'notesList' and 'notesCreateForm'. We are defining them in the next part.

## Templates

We define the templates inside a file called 'client/notes/notes.html' and the depending JS file 'client/notes/notes.js'.

*notes.html:*

```
<template name="notesList">
    <h3>List notes</h3>
    <table class="table">
        <thead>
            <tr>
                <th class="col-xs-4 col-sm-2">Date</th>
                <th class="col-xs-6 col-sm-8">Text</th>
                <th class="col-xs-2 col-sm-2"></th>
            </tr>
        </thead>
        <tbody>
            {{#each notes }}
                <tr>
                    <td>{{ formatDate date }}</td>
                    <td>{{ text }}</td>
                    <td>
                        <button class="btn btn-danger btn-sm deleteNote">Delete</button>
                    </td>
                </tr>
            {{else}}
                <tr>
                    <td colspan="3">No notes...</td>
                </tr>
            {{/each}}
        </tbody>
    </table>
</template>

<template name="notesFilter">
    <form name="filterNotes" class="form-inline">
        <div class="form-group">
            <label for="searchNoteTextInput">Search</label>
            <input id="searchNoteTextInput" type="text" name="noteText" class="form-control" placeholder="Note text" />
        </div>
    </form>
</template>

<template name="notesCreateForm">
    <form name="createNote" class="form-inline">
        <div class="form-group">
            <label for="createNoteTextInput">Create</label>
            <input id="createNoteTextInput" type="text" name="noteText" class="form-control" placeholder="Note text" />
        </div>
    </form>
</template>
```

We define the three templates with ```<template name="template-name">...</template>'. Inside the template 'notesList' we iterate over all notes and show them in a list.

Inside 'notes.js' we subscribe the collection, add events the the forms and the delete button and create a helper to access the list.

*notes.js:*

```
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
```

## Global helper

A global helper, which can be used in each template, is created with the registerHelper-method inside the file 'client/global/helpers.js':

```
Template.registerHelper('formatDate', function (date) {
    if (date instanceof Date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    }
    return '-';
});
```
