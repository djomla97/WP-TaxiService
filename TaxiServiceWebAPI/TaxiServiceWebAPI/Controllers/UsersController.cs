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
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\users.json");
        private JSONParser jsonParserAdmins = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");


        // GET api/users
        public bool Get()
        {
            return true;
        }

        [HttpPost]
        [ActionName("register")]
        // POST api/users
        public HttpResponseMessage PostRegister([FromBody]User newUser)
        {
            newUser.Rides = new List<Ride>();

            jsonParser.WriteUser(newUser);

            return Request.CreateResponse(HttpStatusCode.OK, "Added");

        }

        [HttpPost]
        [ActionName("login")]
        public User PostLogin([FromBody]User loginUser)
        {
            string loginUsername = loginUser.Username;
            string loginPassword = loginUser.Password;

            try
            {
                var foundUser = jsonParser.ReadUsers()
                            .Where(u => u.Username.ToLower().Equals(loginUsername.ToLower()) && u.Password.Equals(loginPassword)).First();

                return foundUser;

            }
            catch (Exception)
            {
                try
                {
                    var foundUser = jsonParserAdmins.ReadUsers()
                                .Where(u => u.Username.ToLower().Equals(loginUsername.ToLower()) && u.Password.Equals(loginPassword)).First();

                    return foundUser;

                }
                catch (Exception)
                {
                    return new User() { Username = null };
                }
            }


        }

    }
}

