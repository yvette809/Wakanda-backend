const jwt = require("jsonwebtoken");

const auth =  (req, res, next) => {
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

};

const admin = (req,res,next)=>{
  if(req.user && req.user.isAdmin){
    next()
  }else{
    res.status(401).json({msg:"not authorised as an admin"})
  }
}

module.exports= {auth, admin}
