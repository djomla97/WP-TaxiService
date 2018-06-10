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
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\users.json");
        private JSONParser jsonParserAdmins = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");
        private JSONParser jsonParserDrivers = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\drivers.json");
        private JSONParser jsonParserRides = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\rides.json");

        // GET /api/rides
        [HttpGet]
        public List<Ride> Get()
        {
            return jsonParserRides.ReadRides();
        }

        // GET /api/rides/id
        [HttpGet]
        [Route("api/rides/{id}")]
        public Ride Get(int id)
        {
            try
            {
                var foundRide = jsonParserRides.ReadRides().Where(r => r.ID == id).First();
                return foundRide;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // GET /api/rides/id
        [HttpGet]
        [Route("api/rides/ordered/{username}")]
        public IEnumerable<Ride> Get(string username)
        {
            try
            {
                var foundRide = jsonParserRides.ReadRides()
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

            if (newRide.RideVehicle.VehicleType == null || newRide.RideVehicle.VehicleType == string.Empty)
                newRide.RideVehicle.VehicleType = VehicleTypes.Passenger.ToString(); 

            Ride writtenRide = jsonParserRides.WriteRide(newRide);

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
                jsonParserRides.EditRide(id, editedRide);

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
                jsonParserRides.DeleteRide(id);
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
                var foundRide = jsonParserRides.ReadRides().Where(r => r.ID == id).First();
                foundRide.StatusOfRide = RideStatuses.CANCELED.ToString();
                foundRide.Comment = comment;
                jsonParserRides.EditRide(id, foundRide);



                return Request.CreateResponse(HttpStatusCode.OK, $"Ride {id} is cancelled.");
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Ride {id} was not cancelled.");
            }
        }

    }
}
