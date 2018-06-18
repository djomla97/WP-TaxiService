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
        public List<Ride> Get(string username)
        {
            // customer
            try
            {
                var foundUser = jsonParser.ReadUsers().Where(u => u.Username == username).First();

                try
                {
                    var foundRides = jsonParser.ReadRides().Where(r => r.RideCustomer.Username == username && r.StatusOfRide != RideStatuses.CREATED_ONWAIT.ToString());
                    return foundRides.ToList();
                }
                catch (Exception)
                {
                    return null;
                }
            }
            catch (Exception)
            {
                try
                {
                    // drivers
                    var foundUser = jsonParser.ReadDrivers().Where(u => u.Username == username).First();

                    try
                    {
                        var foundRides = jsonParser.ReadRides().Where(r => r.RideDriver.Username == username);
                        return foundRides.ToList();
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }
                catch (Exception)
                {
                    try
                    {
                        // drivers
                        var foundUser = jsonParser.ReadDispatchers().Where(u => u.Username == username).First();

                        try
                        {
                            var allRides = jsonParser.ReadRides();
                            List<Ride> rides = new List<Ride>();
                            foreach(var ride in allRides)
                            {
                                if(ride.RideDispatcher != null && ride.RideDispatcher.Username != null)
                                {
                                    if(ride.RideDispatcher.Username == username)
                                    {
                                        rides.Add(ride);
                                    }
                                }
                            }

                            return rides;
                        }
                        catch (Exception)
                        {
                            return null;
                        }
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }

            }
        }
        
        // GET /api/rides/ordered/username
        [HttpGet]
        [Route("api/rides/ordered/{username}")]
        public IEnumerable<Ride> Ordered(string username)
        {
            try
            {
                var allRides = jsonParser.ReadRides();

                List<Ride> orderedRides = new List<Ride>();
                foreach(var ride in allRides)
                {
                    if(ride.RideCustomer != null && ride.RideCustomer.Username != null)
                    {
                        if(ride.RideCustomer.Username == username && ride.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString())
                        {
                            orderedRides.Add(ride);
                        }
                    }
                }
      
                return orderedRides;
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
            newRide.DateAndTime = DateTime.Now;

            if (newRide.RideVehicle.VehicleType == null || newRide.RideVehicle.VehicleType == string.Empty)
                newRide.RideVehicle.VehicleType = VehicleTypes.Passenger.ToString();

            // ko je dodao voznju?
            if (newRide.RideCustomer.Username == null)
                newRide.RideCustomer = new Customer() {};
            else
                newRide.StatusOfRide = RideStatuses.CREATED_ONWAIT.ToString();

            if (newRide.RideDriver.Username == null)
                newRide.RideDriver = new Driver();
            else
                newRide.RideDriver = jsonParser.ReadDrivers().Where(d => d.Username == newRide.RideDriver.Username).First();

            if (newRide.RideDispatcher.Username == null)
                newRide.RideDispatcher = new Dispatcher();
            else
                newRide.StatusOfRide = RideStatuses.FORMED.ToString();

            // dodaj voznju
            Ride writtenRide = jsonParser.WriteRide(newRide);

            if (writtenRide.StatusOfRide == RideStatuses.FORMED.ToString())
            {
                newRide.RideDispatcher.Rides.Add(writtenRide);
                jsonParser.EditDispatcher(newRide.RideDispatcher.Username, newRide.RideDispatcher);

                newRide.RideDriver.Rides.Add(writtenRide);
                jsonParser.EditDriver(newRide.RideDriver.Username, newRide.RideDriver);
            }
            else if (writtenRide.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString()) {
                newRide.RideCustomer.Rides.Add(writtenRide);
                jsonParser.EditUser(newRide.RideCustomer.Username, newRide.RideCustomer);
            }

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

                if (editedRide.RideCustomer.Username != null)
                {
                    if (editedRide.RideCustomer.Role == Roles.Customer.ToString())
                    {
                        var customer = jsonParser.ReadUsers().Where(u => u.Username == editedRide.RideCustomer.Username).First();
                        var rideToRemove = customer.Rides.Where(r => r.ID == editedRide.ID).First();

                        customer.Rides.Remove(rideToRemove);
                        customer.Rides.Add(editedRide);
                        jsonParser.EditUser(customer.Username, customer);
                    }
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

        [HttpPut]
        [Route("api/rides/assign")]
        public int? Assign([FromUri]int rideID, [FromUri]string driver, [FromUri]string dispatcher) {

            try
            {
                var editedRide = jsonParser.ReadRides().Where(r => r.ID == rideID).First();
                var foundDriver = jsonParser.ReadDrivers().Where(d => d.Username == driver).First();
                var foundDispatcher = jsonParser.ReadDispatchers().Where(d => d.Username == dispatcher).First();

                editedRide.RideDriver = foundDriver;
                editedRide.RideDispatcher = foundDispatcher;
                editedRide.StatusOfRide = RideStatuses.PROCESSED.ToString();

                jsonParser.EditRide(rideID, editedRide);

                return editedRide.ID;
            }
            catch (Exception)
            {
                return null;
            }

        }

    }
}
