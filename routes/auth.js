const router = require('express').Router();
const { registerUser, loginUser, logoutUser, currentUser } = require('../controllers/auth');
const checkAuth = require('../middlewares/checkAuth');
const validateBody = require('../middlewares/validateBody');
const { userSchema } = require('../schema/schema');

//Register
router.post('/register', validateBody(userSchema), registerUser);

//Login
router.post('/login', validateBody(userSchema), loginUser);

//Logout
router.post('/logout', checkAuth, logoutUser)

//Current user
router.get('/current-user', checkAuth, currentUser);


module.exports = router;