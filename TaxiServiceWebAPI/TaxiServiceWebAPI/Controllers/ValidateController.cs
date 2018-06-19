using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiServiceWebAPI.Helpers.DocParsers;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI.Controllers
{
    //[RoutePrefix("api/validate")]
    public class ValidateController : ApiController
    {
        private JSONParser jsonParser = new JSONParser();        

        [HttpGet]
        [Route("api/validate/username")]
        public string CheckUsername([FromUri]string username)
        {
            List<Customer> foundUsers = jsonParser.ReadUsers();
            foreach (Customer cust in foundUsers)
            {
                if (cust.Username == username)
                {
                    return "Found";
                }
            }

            List<Driver> foundDrivers = jsonParser.ReadDrivers();
            foreach (Driver driver in foundDrivers)
            {
                if (driver.Username == username)
                {
                    return "Found";
                }
            }

            List<Dispatcher> foundDispatchers = jsonParser.ReadDispatchers();
            foreach (Dispatcher disp in foundDispatchers)
            {
                if (disp.Username == username)
                {
                    return "Found";
                }
            }

            return "Not Found";
        }

        [HttpGet]
        [Route("api/validate/email")]
        public string CheckEmail(string email)
        {

            List<Customer> foundUsers = jsonParser.ReadUsers();
            foreach (Customer cust in foundUsers)
            {
                if (cust.Email == email)
                {
                    return "Found";
                }
            }

            List<Driver> foundDrivers = jsonParser.ReadDrivers();
            foreach (Driver driver in foundDrivers)
            {
                if (driver.Email == email)
                {
                    return "Found";
                }
            }

            List<Dispatcher> foundDispatchers = jsonParser.ReadDispatchers();
            foreach (Dispatcher disp in foundDispatchers)
            {
                if (disp.Email == email)
                {
                    return "Found";
                }
            }

            return "Not Found";
        }

    }
}
