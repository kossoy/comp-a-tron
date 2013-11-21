Meteor.Router.add({
  "/": "itemsList",
  "/items/:_id": {
    to: "itemPage",
    and: function (id) {
      Session.set('currentItemId', id);
    }
  },
  "/submit/": "itemSubmit"
});


Meteor.Router.filters({
  'requireLogin': function (page) {
    if (Meteor.user())
      return page;
    else if (Meteor.loggingIn())
      return 'loading';
    else
      return 'accessDenied';
  }
});

Meteor.Router.filter('requireLogin', {only: 'itemSubmit'});