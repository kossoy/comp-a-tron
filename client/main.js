Meteor.subscribe('items');

Template.itemsList.helpers({
  items: function () {
    var items = Items.find().fetch()
    return _(items).sortBy(function (obj) {
      return parseFloat(obj.price / obj.quantity);
    });
  }
});

Template.rowItem.helpers({
  unitPrice: function () {
    return (this.price / this.quantity * 0.5).toFixed(2);
  }
});

Template.itemPage.helpers({
    currentItem: function () {
      return Items.findOne(Session.get('currentItemId'));
    }
  }
);


Template.itemSubmit.events({
  "submit form": function (e) {
    e.preventDefault();

    var item = {
      title: $(e.target).find("[name=title]").val(),
      quantity: $(e.target).find("[name=quantity]").val(),
      price: $(e.target).find("[name=price]").val()
    };

    Meteor.call('item', item, function (error, id) {
      if (error) {
        return alert(error.reason);
      }
      Meteor.Router.to("itemPage", id);
    });
  }
});