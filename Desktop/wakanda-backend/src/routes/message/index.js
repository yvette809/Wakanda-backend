// const express = require("express")
// const sendMail = require("./mail")
// const messageRouter = express.Router()

// const MessageModel = require("./Schema")


// messageRouter.post("/", async(req,res)=>{
//     // const{name,email,phone,text}= req.body
//     // console.log("the response is", req.body)
    
//     // sendMail(name,email,phone,text, (err,data)=>{
//     //     if(err){
//     //         res.status(500).json({message: "internal error"})
//     //     }else{
//     //        return res.json({message: req.body})
//     //     }

//     // })
    
//     const message = await new MessageModel(req.body)
//     message.save()
//     res.send(message)

// })


// module.exports= messageRouter