using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using TaxiServiceWebAPI.Models;
using TaxiServiceWebAPI.Helpers.DocParsers;

namespace TaxiServiceWebAPI.Controllers
{
    //[EnableCors(origins: "file:///C:/Users/Mladjo/Desktop/TaxiService/WP-TaxiService/mockup/index.html", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private JsonWriter jsonWrites = new JsonWriter(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\users.json");


        // GET api/users
        public string Get()
        { 
            return "opa prodje";
        }

        // POST api/users
        public HttpResponseMessage Post([FromBody] User newUser)
        {
            jsonWrites.WriteUser(newUser);

            return Request.CreateResponse(HttpStatusCode.OK, "Added");
        }

    }
}
