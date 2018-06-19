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
        private JSONParser jsonParser = new JSONParser();

        // GET api/users
        [HttpGet]
        public List<Customer> Get()
        {
            return jsonParser.ReadUsers();
        }

        // GET api/users/username
        [HttpGet]
        public User Get(string username)
        {
            List<Customer> foundUsers = jsonParser.ReadUsers();
            foreach(Customer cust in foundUsers)
            {
                if(cust.Username == username)
                {
                    return cust;
                }
            }

            List<Driver> foundDrivers = jsonParser.ReadDrivers();
            foreach (Driver driver in foundDrivers)
            {
                if (driver.Username == username)
                {
                    return driver;
                }
            }

            List<Dispatcher> foundDispatchers = jsonParser.ReadDispatchers();
            foreach (Dispatcher disp in foundDispatchers)
            {
                if (disp.Username == username)
                {
                    return disp;
                }
            }

            return null;
        }

        // POST api/users
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Customer newUser)
        {
            newUser.Rides = new List<Ride>();
            newUser.Role = Roles.Customer.ToString();
            newUser.Rides = new List<Ride>();

            jsonParser.WriteUser(newUser);

            return Request.CreateResponse(HttpStatusCode.Created, "Created");

        }

        // PUT api/users/username
        public User Put(string username, [FromBody]Driver editedUser)
        {
            if (editedUser.DriverLocation != null)
            {
                try
                {
                    jsonParser.EditDriver(username, editedUser);

                    return editedUser;
                }
                catch (Exception)
                {
                    return null;
                }
            }
            else
            {
                try
                {
                    Customer castCustomer = new Customer();
                    castCustomer.FirstName = editedUser.FirstName;
                    castCustomer.LastName = editedUser.LastName;
                    castCustomer.ContactPhone = editedUser.ContactPhone;
                    castCustomer.Email = editedUser.Email;
                    castCustomer.Gender = editedUser.Gender;
                    castCustomer.JMBG = editedUser.JMBG;
                    castCustomer.Password = editedUser.Password;
                    castCustomer.Rides = editedUser.Rides;
                    castCustomer.Username = editedUser.Username;
                    castCustomer.Role = Roles.Customer.ToString();

                    jsonParser.EditUser(username, castCustomer);

                    return castCustomer;
                }
                catch (Exception)
                {
                    try
                    {
                        Dispatcher castDispatcher = new Dispatcher();
                        castDispatcher.FirstName = editedUser.FirstName;
                        castDispatcher.LastName = editedUser.LastName;
                        castDispatcher.ContactPhone = editedUser.ContactPhone;
                        castDispatcher.Email = editedUser.Email;
                        castDispatcher.Gender = editedUser.Gender;
                        castDispatcher.JMBG = editedUser.JMBG;
                        castDispatcher.Password = editedUser.Password;
                        castDispatcher.Rides = editedUser.Rides;
                        castDispatcher.Username = editedUser.Username;
                        castDispatcher.Role = Roles.Dispatcher.ToString();

                        jsonParser.EditDispatcher(username, castDispatcher);

                        return castDispatcher;
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }
            }
        }

        // prakticnije da postavim u drugi controller, ali da ne pravim radi sitnice jedne
        [HttpGet]
        [Route("api/drivers/free")]
        public List<Driver> FreeDrivers()
        {
            List<Driver> allDrivers = jsonParser.ReadDrivers();
            List<Driver> freeDrivers = new List<Driver>();
            foreach(Driver driver in allDrivers)
            {
                if (driver.IsFree)
                {
                    freeDrivers.Add(driver);
                }
            }

            return freeDrivers;
        }

        // POST api/users
        [HttpPost]
        [Route("api/drivers")]
        public HttpResponseMessage Post([FromBody]Driver newDriver)
        {
            newDriver.Rides = new List<Ride>();
            newDriver.DriverVehicle.CarDriver = newDriver;

            jsonParser.WriteDriver(newDriver);

            return Request.CreateResponse(HttpStatusCode.Created, "Created");
        }

        // GET api/users/
        [HttpPost]
        [Route("api/users/login")]
        public bool Login([FromBody]Credentials credentials)
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
                    var foundUser = jsonParser.ReadDrivers()
                                .Where(u => u.Username.ToLower().Equals(username.ToLower()) && u.Password.Equals(password)).First();

                    return true;

                }
                catch (Exception)
                {
                    try
                    {
                        var foundUser = jsonParser.ReadDispatchers()
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
}

