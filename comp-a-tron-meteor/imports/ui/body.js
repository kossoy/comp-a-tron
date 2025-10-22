import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {RowItems} from "../api/row_items";
import './row_item.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    Session.setDefault('unit', 1);
    Meteor.subscribe('rowItems');

});

Template.body.helpers({
    rowItems() {
        return RowItems.find({}, {sort: {unitPrice: 1}});
    }
});

Template.body.events({
    'submit .new-row-item'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const title = target.title.value;
        const quantity = target.quantity.value;
        const price = target.price.value;
        const unitPrice = (price / quantity).toFixed(2);

        // Insert a task into the collection
        // noinspection JSUnresolvedFunction
        Meteor.call('rowItems.insert',
            title,
            quantity,
            price,
            unitPrice);

        // Clear form
        target.reset();
    },
});