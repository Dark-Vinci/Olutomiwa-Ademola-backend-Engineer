const express = require('express');

const { User } = require('../model/user');
const auth = require('../middleware/auth');
const wrapper = require('../middleware/wrapper');
const bodyValidator = require('../middleware/bodyValidator');
const idValidator = require('../middleware/idValidator');
const { Event, validate, validateEdit } = require('../model/event');

const router = express.Router();

// route handler for the creation of an event object by a registered user
router.post('/create', [ bodyValidator(validate), auth ], wrapper ( async (req, res) => {
    const userId = req.user._id;

    // extracting the needed data from the body of the request
    const { expiresIn, name, paid, price, description } = req.body;

    // the creation of the event object
    const event = new Event({ name, paid, price, expiresIn, description });

    await event.save();
    const eventId = event.id;

    // the user is found and the event list is updated
    const user = await User.findById(userId);
    user.events.push(eventId);

    // the user object is saved
    await user.save();

    // the created event object is returned in the body of the response
    res.status(201).json({
        status: 201,
        message: 'Success',
        data: event
    })
}));


// route handler for updating an event object by the user that created the event
router.put('/edit-event/:id', [ bodyValidator(validateEdit), auth ], wrapper (async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user._id;

    // find the user in the db
    const user = await User.findById(userId);

    // check if the event id is stored in the users list of events
    if (!user.events.includes(eventId)) {
        return res.status(404).json({
            status: 404,
            message: 'file not in collection'
        });
    } else {
        // search for the event in the db
        const event = await Event.findById(eventId);

        if (!event) {
            // event doesnt exist in the db
            return res.status(404).json({
                status: 404,
                message: 'event not found'
            })
        } else {
            // event is found in the db and it is update
            const { name, paid, price, expiresIn, description } = req.body;

            event.set({
                name: name || event.name, 
                paid: paid || event.paid,
                expiresIn: expiresIn || event.expiresIn,
                price: price || event.price,
                description: description || event.description
            });

            await event.save();

            // the new event object is sent in the body of the response
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: event
            })
        }
    }
}));

// route handler for getting an event object by the user that stored the event
router.get('/get-by-id/:id', auth, wrapper (async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.events.includes(eventId)) {
        return res.status(404).json({
            status: 404,
            message: 'event not found'
        })
    } else {
        const event = await Event.findById(eventId);

        if (!event) {   
            return res.status(404).json({
                status: 404,
                message: 'event not found'
            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: event
            })
        }
    }
}))

// route handler for getting all events in the db
// THIS SHOULD BE ONLY FOR ADMIN/SUPERADMIN, by here, anyone can view
router.get('/events-in-db', wrapper( async ( req, res ) => {
    const allEvents = await Event.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: allEvents
    })
}));


// route handler for getting all events of a user
router.get('/my-events', auth, wrapper ( async ( req, res ) => {
    const userId = req.user._id;

    // find the user in the db and populate the list of event
    const user = await User.findById(userId)
        .select({ password: 0 })
        .populate({ path: 'events' });

    if (!user) {
        // the user is not found
        return res.status(404).json({
            status: 404,
            message: 'user does not exist in the database'
        })
    } else {
        // the populated events is sent in tyhe body of the response;
        const events = user.events;

        res.status(200).json({
            status: 200,
            message: 'success',
            data: events
        })
    }
}));

// route handler for deleting an event by passing the id as a request params
router.delete('/remove-event/:id', [ idValidator, auth ], wrapper ( async ( req, res ) => {
    const userId = req.user._id;
    const eventId = req.params.id;

    // find the user in the db
    const user = await User.findById(userId)
        .select({ password: 0 });

        // check if the event id is stored in the user's list of events
    if (!user.events.includes(eventId)) {
        return res.status(404).json({
            status: 404,
            message: 'event not found in db'
        })
    } else {
        // delete and remove the event from the db and user list of events
        const event = await Event.findByIdAndRemove(eventId);

        // the event id is removed from the user's list of events;
        const eventIndex = user.events.indexOf(eventId);
        user.events.splice(eventIndex, 1);

        // user document is saved
        await user.save();

        if (!event) {
            return res.status(404).json({
                status: 404,
                message: 'event not found'
            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: event
            });
        }
    }
}));

module.exports = router;