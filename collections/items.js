Items = new Meteor.Collection('items');

//Items.allow({
//    insert: function (userId, doc) {
//        return !!userId;
//    }
//});

Meteor.methods({
    item: function(postAttributes){
        var user = Meteor.user();
        if(!user){
            throw new Meteor.Error(401, "Ты хто такой давай дасвидания");
        }

        var safeAttributes = _.pick(postAttributes, 'quantity', 'title', 'price');
        var item = _.extend(safeAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });

        var itemId = Items.insert(item);

        return itemId;
    }
});