using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiServiceWebAPI.Helpers.DocParsers;

namespace TaxiServiceWebAPI.Controllers
{
    public class ValidateController : ApiController
    {
        private JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\users.json");
        private JSONParser jsonParserAdmins = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\admins.json");

        // POST /api/validate/username
        [HttpPost]
        [ActionName("username")]
        public string CheckUsername([FromBody]string username)
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
                    var found = jsonParserAdmins.ReadUsers().Where(u => u.Username.ToLower().Equals(username.ToLower())).First();

                    return "Found";
                }
                catch (Exception)
                {

                    return "Not Found";
                }
            }
        }

        // POST /api/validate/email
        [HttpPost]
        [ActionName("email")]
        public string CheckEmail([FromBody]string email)
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
                    var found = jsonParserAdmins.ReadUsers().Where(u => u.Email.ToLower().Equals(email.ToLower())).First();

                    return "Found";
                }
                catch (Exception)
                {

                    return "Not Found";
                }
            }
        }


        // provera jmbg-a, al drzava treba da osigura da nije isti jmbg :)
        /*
        // POST /api/validate/email
        [HttpPost]
        [ActionName("jmbg")]
        public string CheckJMBG([FromBody]string jmbg)
        {

            try
            {
                var found = jsonParser.ReadUsers().Where(u => u.JMBG.ToLower().Equals(jmbg.ToLower())).First();

                return "Found";
            }
            catch (Exception)
            {
                return "Not Found";
            }
        }
        */


    }
}
