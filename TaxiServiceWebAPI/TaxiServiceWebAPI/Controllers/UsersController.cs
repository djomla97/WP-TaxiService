using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using TaxiServiceWebAPI.Models;
using TaxiServiceWebAPI.Helpers.DocParsers;
using System.IO;

namespace TaxiServiceWebAPI.Controllers
{
    //[EnableCors(origins: "file:///C:/Users/Mladjo/Desktop/TaxiService/WP-TaxiService/mockup/index.html", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\users.json");

        // GET api/users
        public bool Get()
        {
            return true;
        }


        // POST api/users
        public HttpResponseMessage Post([FromBody]User newUser)
        {
            newUser.Rides = new List<Ride>();

            jsonParser.WriteUser(newUser);

            return Request.CreateResponse(HttpStatusCode.OK, "Added");

        }

    }
}

