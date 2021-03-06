﻿using System;
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
        public List<User> Get()
        {
            List<User> allUsers = new List<User>();

            var allCustomers = jsonParser.ReadUsers();
            var allDrivers = jsonParser.ReadDrivers();

            foreach(var cust in allCustomers)
                allUsers.Add(cust);

            foreach (var driver in allDrivers)
                allUsers.Add(driver);

            return allUsers;

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
                    // pass postaviti na empty ?
                    cust.Password = "";
                    return cust;
                }
            }

            List<Driver> foundDrivers = jsonParser.ReadDrivers();
            foreach (Driver driver in foundDrivers)
            {
                if (driver.Username == username)
                {
                    driver.Password = "";
                    return driver;
                }
            }

            List<Dispatcher> foundDispatchers = jsonParser.ReadDispatchers();
            foreach (Dispatcher disp in foundDispatchers)
            {
                if (disp.Username == username)
                {
                    disp.Password = "";
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

        [HttpGet]
        [Route("api/drivers/closest")]
        public List<Driver> ClosestDrivers(double x, double y)
        {
            List<Driver> allDrivers = jsonParser.ReadDrivers();
            List<Driver> freeDrivers = new List<Driver>();
            foreach (Driver driver in allDrivers)
            {
                if (driver.IsFree)
                {
                    freeDrivers.Add(driver);
                }
            }

            ///////
            List<Driver> closestDrivers = new List<Driver>();
            Dictionary<Driver, double> distances = new Dictionary<Driver, double>();

            foreach(var driver in freeDrivers)
            {
                double distance = Math.Sqrt(Math.Pow(x - driver.DriverLocation.X, 2) + Math.Pow(y - driver.DriverLocation.Y, 2));
                distances.Add(driver, distance);
            }

            var sortedDist = distances.OrderBy(val => val.Value);

            foreach(var distance in sortedDist)
            {
                closestDrivers.Add(distance.Key);
                if(closestDrivers.Count == 2)
                    break;
            }

            return closestDrivers;
        }
   
        // POST api/drivers
        [HttpPost]
        [Route("api/drivers")]
        public HttpResponseMessage Post([FromBody]Driver newDriver)
        {
            newDriver.Rides = new List<Ride>();
            newDriver.DriverVehicle.CarDriver = newDriver;

            jsonParser.WriteDriver(newDriver);

            return Request.CreateResponse(HttpStatusCode.Created, "Created");
        }

        [HttpPut]
        [Route("api/users/{username}/{banStatus}")]
        public HttpResponseMessage ChangeBan(string username, string banStatus) {
            try
            {
                if (banStatus.ToLower() == "ban")
                {
                    var allUsers = jsonParser.ReadUsers();
                    foreach (var user in allUsers)
                    {
                        if (user.Username == username && user.IsBanned == false)
                        {
                            user.IsBanned = true;
                            jsonParser.EditUser(user.Username, user);
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }

                    var allDrivers = jsonParser.ReadDrivers();
                    foreach (var driver in allDrivers)
                    {
                        if (driver.Username == username && driver.IsBanned == false)
                        {
                            driver.IsBanned = true;
                            jsonParser.EditDriver(driver.Username, driver);
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }

                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
                else if (banStatus.ToLower() == "unban") {
                    var allUsers = jsonParser.ReadUsers();
                    foreach (var user in allUsers)
                    {
                        if (user.Username == username && user.IsBanned == true)
                        {
                            user.IsBanned = false;
                            jsonParser.EditUser(user.Username, user);
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }

                    var allDrivers = jsonParser.ReadDrivers();
                    foreach (var driver in allDrivers)
                    {
                        if (driver.Username == username && driver.IsBanned == true)
                        {
                            driver.IsBanned = false;
                            jsonParser.EditDriver(driver.Username, driver);
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }

                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }

            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // GET api/users/
        [HttpPost]
        [Route("api/users/login")]
        public HttpResponseMessage Login([FromBody]Credentials credentials)
        {
            string username = credentials.Username;
            string password = credentials.Password;

            List<Customer> allUsers = jsonParser.ReadUsers();
            foreach (var user in allUsers)
            {
                if (user.Username.ToLower() == username && user.Password == password)
                {
                    if (!user.IsBanned)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Found");
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Banned");
                    }
                }
            }

            List<Driver> allDrivers = jsonParser.ReadDrivers();
            foreach (var user in allDrivers)
            {
                if (user.Username.ToLower() == username && user.Password == password)
                {
                    if (!user.IsBanned)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Found");
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Banned");
                    }
                }
            }

            List<Dispatcher> allDispatchers = jsonParser.ReadDispatchers();
            foreach (var user in allDispatchers)
                if (user.Username.ToLower() == username && user.Password == password)
                    return Request.CreateResponse(HttpStatusCode.OK, "Found");

            return Request.CreateResponse(HttpStatusCode.OK, "Not found"); ;
        }

    }
}

