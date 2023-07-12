const express = require("express");
const { registerUser , authUser} = require("../controllers/userControllers")


const router = express.Router();

router.post('/',registerUser);

router.post('/login', authUser);







// function fun(req, res) {
//     res.send("this is the api/user");
// }

// router.get('/', (req, res)=> {
//     res.send("success is when you love to work");
// })
// router.route('/').get( (req, res) => {
//     res.send("this is in send by route path")
// })

// router.get('/check', function (req, res) {
//     res.send("success is when you love to work  $ this /api/user/check");
// })
module.exports = router;  // default export 