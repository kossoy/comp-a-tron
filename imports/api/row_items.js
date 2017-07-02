import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const RowItems = new Mongo.Collection('rowItems');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('rowItems', function tasksPublication() {
        return RowItems.find({
            $or: [
                {private: {$ne: true}},
                {owner: this.userId},
            ],
        });
    });
}

Meteor.methods({
    'rowItems.insert'(title, quantity, price, unitPrice) {
        check(title, String);
        check(quantity, String);
        check(price, String);
        check(unitPrice, String);

        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        RowItems.insert({
            title,
            quantity,
            price,
            unitPrice,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'rowItems.remove'(rowItemId) {
        check(rowItemId, String);
        
        const rowItem = RowItems.findOne(rowItemId);
        if (rowItem.private && rowItem.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        RowItems.remove(rowItemId);
    },
    'rowItems.setPrivate'(rowItemId, setToPrivate) {
        check(rowItemId, String);
        check(setToPrivate, Boolean);

        const rowItem = RowItems.findOne(rowItemId);

        // Make sure only the task owner can make a task private
        if (rowItem.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        RowItems.update(rowItemId, {$set: {private: setToPrivate}});
    },

});