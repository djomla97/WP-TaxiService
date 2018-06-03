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
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Controllers
{
    //[EnableCors(origins: "file:///C:/Users/Mladjo/Desktop/TaxiService/WP-TaxiService/mockup/index.html", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\users.json");
        private JSONParser jsonParserAdmins = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");

        // GET api/users
        [HttpGet]
        public List<User> Get()
        {
            return jsonParser.ReadUsers();
        }

        // GET api/users/username
        [HttpGet]
        public User Get(string username)
        {
            try
            {
                var foundUser = jsonParser.ReadUsers()
                            .Where(u => u.Username.ToLower().Equals(username.ToLower())).First();

                return foundUser;

            }
            catch (Exception)
            {
                try
                {
                    var foundUser = jsonParserAdmins.ReadUsers()
                            .Where(u => u.Username.ToLower().Equals(username.ToLower())).First();

                    return foundUser;

                }
                catch (Exception)
                {
                    return null;
                }
            }
        }

        // POST api/users
        [HttpPost]
        public HttpResponseMessage Post([FromBody]User newUser)
        {
            newUser.Rides = new List<Ride>();
            newUser.Role = Roles.Customer.ToString();

            jsonParser.WriteUser(newUser);

            return Request.CreateResponse(HttpStatusCode.Created, "Created");

        }

        // PUT api/users/username
        public User Put(string username, [FromBody]User editedUser)
        {
            try
            {
                jsonParser.EditUser(username, editedUser);

                return editedUser;
            }
            catch (Exception)
            {
                try
                {
                    jsonParserAdmins.EditUser(username, editedUser);

                    return editedUser;
                }
                catch (Exception)
                {
                    return null;
                }
            }
        }

        // GET api/users/
        [HttpPost]
        [Route("api/users/login")]
        public bool Post([FromBody]Credentials credentials)
        {
            string username = credentials.Username;
            string password = credentials.Password;

            try
            {
                var foundUser = jsonParser.ReadUsers()
                            .Where(u => u.Username.ToLower().Equals(username.ToLower()) && u.Password.Equals(password)).First();

                return true;

            }
            catch (Exception)
            {
                try
                {
                    var foundUser = jsonParserAdmins.ReadUsers()
                                .Where(u => u.Username.ToLower().Equals(username.ToLower()) && u.Password.Equals(password)).First();

                    return true;

                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

    }
}

