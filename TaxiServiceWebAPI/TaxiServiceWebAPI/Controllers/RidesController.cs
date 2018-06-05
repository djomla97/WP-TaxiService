﻿using System;
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

        // GET /rides
        [HttpGet]
        public List<Ride> Get()
        {
            return jsonParserRides.ReadRides();
        }

        // GET /rides/id
        [HttpGet]
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

        // POST /rides
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Ride newRide)
        {
            newRide.StatusOfRide = RideStatuses.CREATED_ONWAIT.ToString();

            jsonParserRides.WriteRide(newRide);

            return Request.CreateResponse(HttpStatusCode.Created, "Created");
        }

        // PUT /rides/id
        [HttpPut]
        public Ride Put(int id, [FromBody]Ride editedRide)
        {
            try
            {
                jsonParserDrivers.EditRide(id, editedRide);

                return editedRide;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // DELETE /ride/id


    }
}
