const express = require ("express");
const eventRouter = express.Router();
const q2m = require("query-to-mongo")
const EventModel = require("./schema");


// get all events
eventRouter.get('/', async(req,res,next)=>{
    try{
        const query = q2m(req.query)
        const events = await EventModel.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)

        res.send({
            data: events,
            total: events.length
        })

    }catch(error){
        next(error)
    }
    const events = await EventModel.find(req.query)
})

// get a specific event

eventRouter.get("/:id", async(req,res,next)=>{
    try{
        const event = await EventModel.findById(req.params.id)
        if(event){
            res.status(200).send(event)
        }else{
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    }catch(error){
        next(error)
    }
    
})

// create an event
eventRouter.post ("/", async(req,res,next)=>{
    const newEvent = new EventModel(req.body)
    const response = await newEvent.save()
    res.status(201).send(response)
})

// update event
eventRouter.put("/:id", async(req,res,next)=>{
    try{
        const event = await EventModel.findByIdAndUpdate(req.params.id, req.body)
        if(event){
            res.status(200).send(event)
        }else{
            const error = new Error();
            error.httpStatusCode= 404;
            next(error)
        }

    }catch(error){
        next(error)
    }
})

// delete event

eventRouter.delete("/:id", async(req,res,next)=>{
    try{
        const event = await EventModel.findByIdAndDelete(req.params.id)
        if(event){
            res.status(200).send("deleted")
        }else{
            const error = new Error();
            error.httpStatusCode= 404;
            next(error);
        }
    }catch(error){
        next(error)
    }
    
})



  module.exports= eventRouter;