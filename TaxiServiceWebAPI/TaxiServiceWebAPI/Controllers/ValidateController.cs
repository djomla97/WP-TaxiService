using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiServiceWebAPI.Helpers.DocParsers;

namespace TaxiServiceWebAPI.Controllers
{
    //[RoutePrefix("api/validate")]
    public class ValidateController : ApiController
    {
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\users.json");
        private JSONParser jsonParserAdmins = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");
        private JSONParser jsonParserDrivers = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\drivers.json");

        [HttpGet]
        [Route("api/validate/username")]
        public string CheckUsername([FromUri]string username)
        {

            try
            {
                var found = jsonParser.ReadUsers().Where(u => u.Username.ToLower().Equals(username.ToLower())).First();                

                return "Found";
            }
            catch (Exception)
            {
                try
                {
                    var found = jsonParserDrivers.ReadUsers().Where(u => u.Username.ToLower().Equals(username.ToLower())).First();

                    return "Found";
                }
                catch (Exception)
                {

                    try
                    {
                        var found = jsonParserAdmins.ReadUsers().Where(u => u.Username.ToLower().Equals(username.ToLower())).First();

                        return "Found";
                    }
                    catch (Exception)
                    {

                        return "Not Found";
                    }
                }
            }
        }

        [HttpGet]
        [Route("api/validate/email")]
        public string CheckEmail(string email)
        {

            try
            {
                var found = jsonParser.ReadUsers().Where(u => u.Email.ToLower().Equals(email.ToLower())).First();

                return "Found";
            }
            catch (Exception)
            {
                try
                {
                    var found = jsonParserDrivers.ReadUsers().Where(u => u.Email.ToLower().Equals(email.ToLower())).First();

                    return "Found";
                }
                catch (Exception)
                {

                    try
                    {
                        var found = jsonParserAdmins.ReadUsers().Where(u => u.Email.ToLower().Equals(email.ToLower())).First();

                        return "Found";
                    }
                    catch (Exception)
                    {

                        return "Not Found";
                    }
                }
            }
        }

    }
}
