const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.locals.user = currentUser;
    res.render('cars/index.ejs', {
      user: currentUser,
      Storage: currentUser.Storage,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('cars/new.ejs', { user: req.session.user });
});

router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.date = new Date(req.body.date);

    currentUser.Storage.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/cars`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:itemId', async (req, res) => {
  try {
    console.log(req.baseUrl)
    const currentUser = await User.findById(req.session.user._id);
    let car = currentUser.Storage.id(req.params.itemId);

    if(car){
      res.render('cars/show.ejs', {
        car,
      });
    }else{
      const otherUser = User.findById(req.baseUrl.split('/')[2])
      car = otherUser.Storage.id(otherUser._id)

      res.render('cars/show.ejs', {
        car,
      });
    }
    
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.Storage.id(req.params.itemId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/cars`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:itemId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const car = currentUser.Storage.id(req.params.itemId);
    res.render('cars/edit.ejs', {
      car: car,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const car = currentUser.Storage.id(req.params.itemId);
    car.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/cars/${req.params.itemId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
