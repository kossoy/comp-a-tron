if (Items.find().count() === 0) {
  Items.insert({
    quantity: 2.5,
    price: 35,
    title: 'Янтарное'
  });

  Items.insert({
    quantity: 1.5,
    price: 25,
    title: 'Чешское'
  });

  Items.insert({
    quantity: 0.5,
    price: 11,
    title: 'Туборг'
  });
}