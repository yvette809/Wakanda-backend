const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // get token from the header
  const token = req.headers["x-auth-token"];
  console.log(req.headers)
  // check if there is no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorisation denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.jwt_Secret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }

// try {
//     jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
//       if (error) {
//         return res.status(401).json({ msg: 'Token is not valid' });
//       } else {
//         req.user = decoded.user;
//         next();
//       }
//     });
//   } catch (err) {
//     console.error('something wrong with auth middleware');
//     res.status(500).json({ msg: 'Server Error' });
//   }

};
