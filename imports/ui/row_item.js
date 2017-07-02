import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {RowItems} from "../api/row_items";
import './row_item.html';

Template.rowItem.events({
    'click .delete'() {
        Meteor.call('rowItems.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('rowItems.setPrivate', this._id, !this.private);
    },
});

Template.rowItem.helpers({
    getUnitPrice(unitPrice) {
        return unitPrice * parseFloat(Session.get('unit'));
    },
    isOwner() {
        return this.owner === Meteor.userId();
    },
});