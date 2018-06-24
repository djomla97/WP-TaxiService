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
            try
            {
                return jsonParser.ReadRides();
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/rides/{id:int}")]
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
            List<Ride> allRides = new List<Ride>();
            allRides = jsonParser.ReadRides();
            if (allRides == null)
                return null;

            List<Ride> foundRides = new List<Ride>();

            foreach (Ride ride in allRides)
            {
                if (ride.RideCustomer != null)
                {
                    if (ride.RideCustomer.Username == username)
                    {
                        foundRides.Add(ride);
                    }
                }

                if (ride.RideDriver != null)
                {
                    if (ride.RideDriver.Username == username)
                    {
                        foundRides.Add(ride);
                    }
                }

                if (ride.RideDispatcher != null)
                {
                    if (ride.RideDispatcher.Username == username)
                    {
                        foundRides.Add(ride);
                    }
                }
            }

            return foundRides;
        }


        // POST /api/rides
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Ride newRide)
        {
            try
            {
                newRide.DateAndTime = DateTime.Now;

                if (newRide.RideVehicle.VehicleType == null || newRide.RideVehicle.VehicleType == string.Empty)
                    newRide.RideVehicle.VehicleType = VehicleTypes.Passenger.ToString();

                // ko je dodao voznju?
                if (newRide.RideCustomer == null)
                    newRide.RideCustomer = new Customer() { };
                else
                    newRide.StatusOfRide = RideStatuses.CREATED_ONWAIT.ToString();

                if (newRide.RideDriver == null)
                {
                    newRide.RideDriver = new Driver();
                }
                else
                {
                    newRide.RideDriver = jsonParser.ReadDrivers().Where(d => d.Username == newRide.RideDriver.Username).First();
                    newRide.RideDriver.IsFree = false;
                    jsonParser.EditDriver(newRide.RideDriver.Username, newRide.RideDriver);
                }

                if (newRide.RideDispatcher == null)
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
                else if (writtenRide.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString())
                {
                    newRide.RideCustomer.Rides.Add(writtenRide);
                    jsonParser.EditUser(newRide.RideCustomer.Username, newRide.RideCustomer);
                }

                return Request.CreateResponse(HttpStatusCode.Created, $"{writtenRide.ID}");
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // PUT /api/rides/id
        [HttpPut]
        [Route("api/rides/{id}")]
        public Ride Put(int id, [FromBody]Ride editedRide)
        {
            
            try
            {
                if (editedRide.RideComment.Description != null)
                {
                    editedRide.RideComment.DateAndTime = DateTime.Now;
                }
                else
                {
                    editedRide.DateAndTime = DateTime.Now;
                }

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
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, $"Ride {id} was not deleted.");
            }
        }

        [HttpPut]
        [Route("api/rides/{id}/{state}")]
        public HttpResponseMessage Put([FromUri]int id, [FromUri]string state, [FromBody]Options options)
        {
            if (state.ToLower() == "fail")
            {
                List<Ride> allRides = jsonParser.ReadRides();
                Ride foundRide = new Ride();

                foreach (var ride in allRides)
                {
                    if (ride.ID == id)
                    {
                        foundRide = ride;
                        break;
                    }
                }

                if (foundRide.ID == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
                else
                {
                    try
                    {
                        foundRide.StatusOfRide = RideStatuses.FAILED.ToString();
                        foundRide.RideComment.CommentUser = new User();
                        foundRide.RideComment.CommentUser.FirstName = foundRide.RideDriver.FirstName;
                        foundRide.RideComment.CommentUser.LastName = foundRide.RideDriver.LastName;
                        foundRide.RideComment.CommentUser.Username = foundRide.RideDriver.Username;
                        foundRide.RideComment.CommentUser.Role = foundRide.RideDriver.Role;
                        foundRide.RideComment.DateAndTime = DateTime.Now;
                        foundRide.RideComment.Description = options.Comment;

                        switch (options.RideMark)
                        {
                            case 1: foundRide.RideComment.RideMark = RideMarks.ONE; break;
                            case 2: foundRide.RideComment.RideMark = RideMarks.TWO; break;
                            case 3: foundRide.RideComment.RideMark = RideMarks.THREE; break;
                            case 4: foundRide.RideComment.RideMark = RideMarks.FOUR; break;
                            case 5: foundRide.RideComment.RideMark = RideMarks.FIVE; break;
                            default: foundRide.RideComment.RideMark = RideMarks.ZERO; break;
                        }

                        jsonParser.EditRide(foundRide.ID, foundRide);

                        // free driver
                        foundRide.RideDriver.IsFree = true;                        
                        jsonParser.EditDriver(foundRide.RideDriver.Username, foundRide.RideDriver);

                        return Request.CreateResponse(HttpStatusCode.OK, foundRide.ID);
                    }
                    catch (Exception)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest);
                    }

                }
            }
            else if (state.ToLower() == "success")
            {
                List<Ride> allRides = jsonParser.ReadRides();
                Ride foundRide = new Ride();

                foreach (var ride in allRides)
                {
                    if (ride.ID == id)
                    {
                        foundRide = ride;
                        break;
                    }
                }

                if (foundRide.ID == 0)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
                else
                {
                    try
                    {
                        foundRide.StatusOfRide = RideStatuses.SUCCESSFUL.ToString();
                        foundRide.Fare = options.Fare;

                        switch (options.RideMark)
                        {
                            case 1: foundRide.RideComment.RideMark = RideMarks.ONE; break;
                            case 2: foundRide.RideComment.RideMark = RideMarks.TWO; break;
                            case 3: foundRide.RideComment.RideMark = RideMarks.THREE; break;
                            case 4: foundRide.RideComment.RideMark = RideMarks.FOUR; break;
                            case 5: foundRide.RideComment.RideMark = RideMarks.FIVE; break;
                            default: foundRide.RideComment.RideMark = RideMarks.ZERO; break;
                        }

                        foundRide.Destination = new Location();
                        foundRide.Destination.LocationAddress = new Address();
                        foundRide.Destination.X = options.Location.X;
                        foundRide.Destination.Y = options.Location.Y;
                        foundRide.Destination.LocationAddress.Street = options.Location.LocationAddress.Street;
                        foundRide.Destination.LocationAddress.City = options.Location.LocationAddress.City;
                        foundRide.Destination.LocationAddress.ZipCode = options.Location.LocationAddress.ZipCode;

                        jsonParser.EditRide(foundRide.ID, foundRide);

                        // free driver
                        foundRide.RideDriver.IsFree = true;
                        foundRide.RideDriver.DriverLocation.X = options.Location.X;
                        foundRide.RideDriver.DriverLocation.Y = options.Location.Y;
                        foundRide.RideDriver.DriverLocation.LocationAddress.Street = options.Location.LocationAddress.Street;
                        foundRide.RideDriver.DriverLocation.LocationAddress.City = options.Location.LocationAddress.City;
                        foundRide.RideDriver.DriverLocation.LocationAddress.ZipCode = options.Location.LocationAddress.ZipCode;
                        jsonParser.EditDriver(foundRide.RideDriver.Username, foundRide.RideDriver);

                        return Request.CreateResponse(HttpStatusCode.OK, foundRide.ID);
                    }
                    catch (Exception)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest);
                    }

                }
            }



            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        [Route("api/rides/{id:int}/comment")]
        public HttpResponseMessage Comment(int id, [FromBody]Comment userComment)
        {
            try
            {        
                Ride userRide = jsonParser.ReadRides().Where(r => r.ID == id).First();

                if (userRide.StatusOfRide == RideStatuses.SUCCESSFUL.ToString())
                {
                    userRide.RideComment = new Comment();
                    userRide.RideComment.DateAndTime = DateTime.Now;
                    userRide.RideComment.RideMark = userComment.RideMark;
                    userRide.RideComment.CommentUser = userComment.CommentUser;
                    userRide.RideComment.Description = userComment.Description;

                    jsonParser.EditRide(userRide.ID, userRide);
                    return Request.CreateResponse(HttpStatusCode.OK, "OK");
                }
                else {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Bad request");
                }
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Bad request");
            }
        }


        [HttpPost]
        [Route("api/rides/cancel/{id}")]
        public HttpResponseMessage Cancel(int id, [FromBody]Options options)
        {
            try
            {
                var foundRide = jsonParser.ReadRides().Where(r => r.ID == id).First();
                var foundUser = jsonParser.ReadUsers().Where(u => u.Username.Equals(foundRide.RideCustomer.Username)).First();

                foundRide.StatusOfRide = RideStatuses.CANCELED.ToString();
                foundRide.RideComment = new Comment();
                foundRide.RideComment.CommentRide = new Ride();
                foundRide.RideComment.CommentRide = foundRide;
                foundRide.RideComment.DateAndTime = DateTime.Now;
                foundRide.RideComment.Description = options.Comment;

                switch (options.RideMark)
                {
                    case 1: foundRide.RideComment.RideMark = RideMarks.ONE; break;
                    case 2: foundRide.RideComment.RideMark = RideMarks.TWO; break;
                    case 3: foundRide.RideComment.RideMark = RideMarks.THREE; break;
                    case 4: foundRide.RideComment.RideMark = RideMarks.FOUR; break;
                    case 5: foundRide.RideComment.RideMark = RideMarks.FIVE; break;
                    default: foundRide.RideComment.RideMark = RideMarks.ZERO; break;
                }

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
        public int? Assign([FromUri]int rideID, [FromUri]string driver, [FromUri]string dispatcher)
        {
            try
            {
                var editedRide = jsonParser.ReadRides().Where(r => r.ID == rideID).First();
                var foundDriver = jsonParser.ReadDrivers().Where(d => d.Username == driver).First();
                var foundDispatcher = jsonParser.ReadDispatchers().Where(d => d.Username == dispatcher).First();

                editedRide.RideDriver = foundDriver;
                editedRide.RideDispatcher = foundDispatcher;
                editedRide.StatusOfRide = RideStatuses.PROCESSED.ToString();

                jsonParser.EditRide(rideID, editedRide);

                foundDriver.IsFree = false;
                jsonParser.EditDriver(foundDriver.Username, foundDriver);

                return editedRide.ID;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        [Route("api/rides/ordered")]
        public List<Ride> Ordered()
        {
            List<Ride> allRides = jsonParser.ReadRides();
            List<Ride> orderedRides = new List<Ride>();

            if (allRides != null)
            {
                foreach (Ride ride in allRides)
                {
                    if (ride.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString())
                        orderedRides.Add(ride);
                }
            }
            else
            {
                return null;
            }
            return orderedRides;
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
                foreach (var ride in allRides)
                {
                    if (ride.RideCustomer != null && ride.RideCustomer.Username != null)
                    {
                        if (ride.RideCustomer.Username == username && ride.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString())
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

        [HttpPut]
        [Route("api/rides/take/{id}/{username}")]
        public HttpResponseMessage Take([FromUri]int id, [FromUri]string username)
        {
            try
            {
                List<Ride> allRides = jsonParser.ReadRides();
                Ride foundRide = new Ride();

                if (allRides != null)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.ID == id)
                        {
                            foundRide = ride;
                            break;
                        }
                    }

                    if (foundRide.ID != 0)
                    {
                        List<Driver> allDrivers = jsonParser.ReadDrivers();
                        Driver foundDriver = new Driver();

                        if (allDrivers != null)
                        {
                            foreach (var driver in allDrivers)
                            {
                                if (driver.Username == username)
                                {
                                    foundDriver = driver;
                                    break;
                                }
                            }
                        }
                        else
                        {
                            return Request.CreateResponse(HttpStatusCode.NotFound);
                        }

                        if (foundDriver.Username != null)
                        {
                            foundRide.RideDriver = foundDriver;
                            foundRide.RideDriver.Username = foundDriver.Username;
                            foundRide.RideDriver.FirstName = foundDriver.FirstName;
                            foundRide.RideDriver.LastName = foundDriver.LastName;

                            foundRide.StatusOfRide = RideStatuses.ACCEPTED.ToString();

                            jsonParser.EditRide(foundRide.ID, foundRide);

                            foundDriver.IsFree = false;
                            jsonParser.EditDriver(foundDriver.Username, foundDriver);

                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                        else
                        {
                            return Request.CreateResponse(HttpStatusCode.NotFound);
                        }

                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound);
                    }

                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [HttpPut]
        [Route("api/rides/{username}/filter")]
        public List<Ride> Filter(string username, [FromBody]FilterOptions filterOptions)
        {
            try
            {
                List<Ride> allRides = jsonParser.ReadRides();
                List<Ride> userRides = new List<Ride>();

                foreach (var ride in allRides)
                {
                    if (ride.RideCustomer != null)
                    {
                        if (ride.RideCustomer.Username != null)
                        {
                            if (ride.RideCustomer.Username == username)
                            {
                                userRides.Add(ride);
                            }
                        }
                    }

                    if (ride.RideDriver != null)
                    {
                        if (ride.RideDriver.Username != null)
                        {
                            if (ride.RideDriver.Username == username)
                            {
                                userRides.Add(ride);
                            }
                        }
                    }

                    if (ride.RideDispatcher != null)
                    {
                        if (ride.RideDispatcher.Username != null)
                        {
                            if (ride.RideDispatcher.Username == username)
                            {
                                userRides.Add(ride);
                            }
                        }
                    }
                }

                if (userRides.Count == 0)
                    return null;

                bool checkStartDate = false;
                bool checkEndDate = false;
                bool checkMinRating = false;
                bool checkMaxRating = false;
                bool checkMinFare = false;
                bool checkMaxFare = false;
                bool checkDriverFirstName = false;
                bool checkDriverLastName = false;
                bool checkUserFirstName = false;
                bool checkUserLastName = false;

                DateTime startDateParsed = filterOptions.startDate.ToLocalTime();
                if (filterOptions.startDate.Year != 1)
                    checkStartDate = true;

                DateTime endDateParsed = filterOptions.endDate.ToLocalTime().AddHours(23).AddMinutes(59).AddSeconds(59);
                if (filterOptions.endDate.Year != 1)
                    checkEndDate = true;  
                

                if (filterOptions.minRating > 0)
                    checkMinRating = true;
                if (filterOptions.maxRating < 5)
                    checkMaxRating = true;
                if (filterOptions.minFare > 0)
                    checkMinFare = true;
                if (filterOptions.maxFare > 0)
                    checkMaxFare = true;

                if (filterOptions.driverFirstName != null)
                    checkDriverFirstName = true;
                if (filterOptions.driverLastName != null)
                    checkDriverLastName = true;
                if (filterOptions.userFirstName != null)
                    checkUserFirstName = true;
                if (filterOptions.userLastName != null)
                    checkUserLastName = true;


                List<Ride> filteredRides = new List<Ride>(userRides);
                if (checkStartDate)
                {
                    foreach(var ride in userRides)
                        if (ride.DateAndTime < startDateParsed)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);

                }

                if (checkEndDate)
                {
                    foreach (var ride in userRides)
                        if (ride.DateAndTime > endDateParsed)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);
                }

                if (checkMinRating)
                {
                    foreach(var ride in userRides)
                    {
                        if(ride.RideComment != null)
                        {
                            if ((int)ride.RideComment.RideMark < filterOptions.minRating)                            
                                if (filteredRides.Contains(ride))
                                    filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkMaxRating)
                {
                    foreach (var ride in userRides)
                    {
                        if (ride.RideComment != null)
                        {
                            if ((int)ride.RideComment.RideMark > filterOptions.maxRating)
                                if (filteredRides.Contains(ride))
                                    filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkMinFare)
                {
                    foreach (var ride in userRides)
                    {                        
                        if (ride.Fare < filterOptions.minFare)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);
                        
                    }
                }

                if (checkMaxFare)
                {
                    foreach (var ride in userRides)
                    {
                        if (ride.Fare > filterOptions.maxFare)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);

                    }
                }

                if (checkDriverFirstName)
                {
                    foreach(var ride in userRides)
                    {
                        if(ride.RideDriver != null)
                        {
                            if(ride.RideDriver.FirstName != null)
                            {
                                if (!ride.RideDriver.FirstName.ToLower().Contains(filterOptions.driverFirstName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }                        
                    }
                }

                if (checkDriverLastName)
                {
                    foreach (var ride in userRides)
                    {
                        if (ride.RideDriver != null)
                        {
                            if (ride.RideDriver.LastName != null)
                            {
                                if (!ride.RideDriver.LastName.ToLower().Contains(filterOptions.driverLastName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkUserFirstName)
                {
                    foreach (var ride in userRides)
                    {
                        if (ride.RideCustomer != null)
                        {
                            if (ride.RideCustomer.FirstName != null)
                            {
                                if (!ride.RideCustomer.FirstName.ToLower().Contains(filterOptions.userFirstName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkUserLastName)
                {
                    foreach (var ride in userRides)
                    {
                        if (ride.RideCustomer != null)
                        {
                            if (ride.RideCustomer.LastName != null)
                            {
                                if (!ride.RideCustomer.LastName.ToLower().Contains(filterOptions.userLastName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                return filteredRides;

            }
            catch (Exception)
            {
                return null;
            }

        }

        [HttpPut]
        [Route("api/rides/filter")]
        public List<Ride> Filter([FromBody]FilterOptions filterOptions)
        {
            try
            {
                List<Ride> allRides = jsonParser.ReadRides();

                if (allRides.Count == 0)
                    return null;

                bool checkStartDate = false;
                bool checkEndDate = false;
                bool checkMinRating = false;
                bool checkMaxRating = false;
                bool checkMinFare = false;
                bool checkMaxFare = false;
                bool checkDriverFirstName = false;
                bool checkDriverLastName = false;
                bool checkUserFirstName = false;
                bool checkUserLastName = false;

                DateTime startDateParsed = filterOptions.startDate.ToLocalTime();
                if (filterOptions.startDate.Year != 1)
                    checkStartDate = true;

                DateTime endDateParsed = filterOptions.endDate.ToLocalTime().AddHours(23).AddMinutes(59).AddSeconds(59);
                if (filterOptions.endDate.Year != 1)
                    checkEndDate = true;


                if (filterOptions.minRating > 0)
                    checkMinRating = true;
                if (filterOptions.maxRating < 5)
                    checkMaxRating = true;
                if (filterOptions.minFare > 0)
                    checkMinFare = true;
                if (filterOptions.maxFare > 0)
                    checkMaxFare = true;

                if (filterOptions.driverFirstName != null)
                    checkDriverFirstName = true;
                if (filterOptions.driverLastName != null)
                    checkDriverLastName = true;
                if (filterOptions.userFirstName != null)
                    checkUserFirstName = true;
                if (filterOptions.userLastName != null)
                    checkUserLastName = true;

                List<Ride> filteredRides = new List<Ride>(allRides);
                if (checkStartDate)
                {
                    foreach (var ride in allRides)
                        if (DateTime.Compare(ride.DateAndTime, startDateParsed) < 0)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);

                }

                if (checkEndDate)
                {
                    foreach (var ride in allRides)
                        if (DateTime.Compare(ride.DateAndTime, endDateParsed) > 0)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);
                }

                if (checkMinRating)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideComment != null)
                        {
                            if ((int)ride.RideComment.RideMark < filterOptions.minRating)
                                if (filteredRides.Contains(ride))
                                    filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkMaxRating)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideComment != null)
                        {
                            if ((int)ride.RideComment.RideMark > filterOptions.maxRating)
                                if (filteredRides.Contains(ride))
                                    filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkMinFare)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.Fare < filterOptions.minFare)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);

                    }
                }

                if (checkMaxFare)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.Fare > filterOptions.maxFare)
                            if (filteredRides.Contains(ride))
                                filteredRides.Remove(ride);

                    }
                }

                if (checkDriverFirstName)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideDriver != null)
                        {
                            if (ride.RideDriver.FirstName != null)
                            {
                                if (!ride.RideDriver.FirstName.ToLower().Contains(filterOptions.driverFirstName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkDriverLastName)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideDriver != null)
                        {
                            if (ride.RideDriver.LastName != null)
                            {
                                if (!ride.RideDriver.LastName.ToLower().Contains(filterOptions.driverLastName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkUserFirstName)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideCustomer != null)
                        {
                            if (ride.RideCustomer.FirstName != null)
                            {
                                if (!ride.RideCustomer.FirstName.ToLower().Contains(filterOptions.userFirstName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                if (checkUserLastName)
                {
                    foreach (var ride in allRides)
                    {
                        if (ride.RideCustomer != null)
                        {
                            if (ride.RideCustomer.LastName != null)
                            {
                                if (!ride.RideCustomer.LastName.ToLower().Contains(filterOptions.userLastName.ToLower()))
                                    filteredRides.Remove(ride);
                            }
                            else
                            {
                                filteredRides.Remove(ride);
                            }
                        }
                        else
                        {
                            filteredRides.Remove(ride);
                        }
                    }
                }

                return filteredRides;

            }
            catch (Exception)
            {
                return null;
            }

        }

    }
}
