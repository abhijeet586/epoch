const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const users = [];

router.post("/register",(req,res)=>{
    const { email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "email and password required"});
    }

    users.push({email , password});
    res.json({ message: "user registered"});
});

const jwt = require("jsonwebtoken");

router.post("/login",(req,res)=>{
    const { email , password } = req.body;

    const user = users.find(
        (u)=> u.email === email && u.password ===password
    );
    if(!user){
        return res.status(401).json({error:"invalid credentials"});
    }

    const token  = jwt.sign(
        {email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    res.json({token});
})

router.get("/all",auth,(req,res)=>{
    res.json({users, currentUser: req.user});
});

module.exports = router;