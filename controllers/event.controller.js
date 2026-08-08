const eventService = require('../services/event.service');

//Export controller functions directly
module.exports={

      /**
   * $$$-Funtion Creation: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Most Recent Change: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Function Description:
   *    Adds user to an event using the userId and eventId
   * (the eventId should be in the body)
   * $$$-Component Using This Function:
   *    Post /api/events/:id endpoint uses this function to addEvents
   * $$$-Description of Variables:
   *    userId is the uid from the query params
   *    eventId is a number passed from the req body
   *
   * */
    async addUserToEvent(req, res, next){
        try{
            const {userId} = req.params;
            const {eventId} = req.body;

            const result = await eventService.addUserToEvent(userId, eventId);

            res.status(200).json({
                success: true,
                message: 'User added to event successfully',
                data: result
            });

        }catch (error){
            next(error)
        }
    }
}