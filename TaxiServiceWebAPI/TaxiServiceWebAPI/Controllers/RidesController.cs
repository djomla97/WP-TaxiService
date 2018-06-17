using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiServiceWebAPI.Helpers;
using TaxiServiceWebAPI.Helpers.DocParsers;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI.Controllers
{
    public class RidesController : ApiController
    {
        private JSONParser jsonParser = new JSONParser();

        // GET /api/rides
        [HttpGet]
        public List<Ride> Get()
        {
            return jsonParser.ReadRides();
        }

        [HttpGet]
        public Ride Get(int id)
        {          
            try
            {
                var foundRide = jsonParser.ReadRides().Where(r => r.ID == id).First();

                return foundRide;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // GET /api/rides/id
        [HttpGet]
        [Route("api/rides/{username}")]
        public IEnumerable<Ride> Get(string username)
        {
            try
            {
                var foundRides = jsonParser.ReadRides()
                    .Where(r => r.RideCustomer.Username.ToLower().Equals(username.ToLower()) && r.StatusOfRide != RideStatuses.CREATED_ONWAIT.ToString());

                return foundRides;
            }
            catch (Exception)
            {
                return null;
            }
        }
        
        // GET /api/rides/ordered/username
        [HttpGet]
        [Route("api/rides/ordered/{username}")]
        public IEnumerable<Ride> Ordered(string username)
        {
            try
            {
                var foundRide = jsonParser.ReadRides()
                    .Where(r => r.RideCustomer.Username.ToLower().Equals(username.ToLower()) && r.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString());

                return foundRide;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // POST /api/rides
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Ride newRide)
        {
            newRide.StatusOfRide = RideStatuses.CREATED_ONWAIT.ToString();
            newRide.DateAndTime = DateTime.Now;

            if (newRide.RideVehicle.VehicleType == null || newRide.RideVehicle.VehicleType == string.Empty)
                newRide.RideVehicle.VehicleType = VehicleTypes.Passenger.ToString(); 

            Ride writtenRide = jsonParser.WriteRide(newRide);

            newRide.RideCustomer.Rides.Add(writtenRide);
            jsonParser.EditUser(newRide.RideCustomer.Username, newRide.RideCustomer);

            return Request.CreateResponse(HttpStatusCode.Created, $"{writtenRide.ID}");
        }

        // PUT /api/rides/id
        [HttpPut]
        [Route("api/rides/{id}")]
        public Ride Put(int id, [FromBody]Ride editedRide)
        {
            try
            {
                jsonParser.EditRide(id, editedRide);

                if(editedRide.RideCustomer.Role == Roles.Customer.ToString())
                {
                    var editedUser = editedRide.RideCustomer;
                    var rideToRemove = editedUser.Rides.Where(r => r.ID == editedRide.ID).First();

                    editedUser.Rides.Remove(rideToRemove);
                    editedUser.Rides.Add(editedRide);
                    jsonParser.EditUser(editedUser.Username, editedUser);
                }

                return editedRide;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // DELETE /api/ride/id
        [HttpDelete]
        [Route("api/rides/{id}")]
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                jsonParser.DeleteRide(id);
                return Request.CreateResponse(HttpStatusCode.OK, $"Ride {id} is deleted.");
            }
            catch (Exception) {
                return Request.CreateResponse(HttpStatusCode.BadRequest, $"Ride {id} was not deleted.");
            }
        }

        [HttpPost]
        [Route("api/rides/cancel/{id}")]
        public HttpResponseMessage Cancel(int id, [FromBody]string comment)
        {
            try {
                var foundRide = jsonParser.ReadRides().Where(r => r.ID == id).First();
                var foundUser = jsonParser.ReadUsers().Where(u => u.Username.Equals(foundRide.RideCustomer.Username)).First();

                foundRide.StatusOfRide = RideStatuses.CANCELED.ToString();
                foundRide.RideComment = new Comment();
                foundRide.RideComment.CommentRide = new Ride();
                foundRide.RideComment.CommentRide = foundRide;
                foundRide.RideComment.DateAndTime = DateTime.Now;
                foundRide.RideComment.Description = comment;
                foundRide.RideComment.RideMark = RideMarks.ZERO;
                foundRide.RideComment.CommentUser = foundUser;

                jsonParser.EditRide(id, foundRide);

                jsonParser.DeleteRideFromUser(foundUser, foundRide);

                return Request.CreateResponse(HttpStatusCode.OK, $"Ride {id} is cancelled.");
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Ride {id} was not cancelled.");
            }
        }

    }
}
