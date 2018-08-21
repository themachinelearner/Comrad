const router = require('express').Router();

const albumRoutes = require('./album');
const announcementRoutes = require('./announcement');
const trackRoutes = require('./track');
const userRoutes = require('./user');
const venueRoutes = require('./venue');

router.use('/album', albumRoutes);
router.use('/announcement', announcementRoutes);
router.use('/track', trackRoutes);
router.use('/user', userRoutes);
router.use('/venue', venueRoutes);

module.exports = router;