const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");//my middleware for authentication(centralized)
const pool = require("../db");//my database

router.post("/register",async (req,res)=>{
    const { email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "email and password required"});
    }

    try{
        await pool.query(
            "INSERT INTO users (email,password) VALUES ($1,$2)",
            [email,password]
        );
        res.json({ message: "user registered"});
    }catch(err){
        res.status(400).json({error:"user already exists"});
    }
    
});

const jwt = require("jsonwebtoken");

router.post("/login",async (req,res)=>{
    const { email , password } = req.body;
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    const user = result.rows[0];
    if(!user || user.password !== password){
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