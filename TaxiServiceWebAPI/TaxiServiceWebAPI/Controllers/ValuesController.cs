using System.Collections.Generic;
using System.Web.Http;
using TaxiServiceWebAPI.Helpers.DocParsers;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI.Controllers
{
    public class ValuesController : ApiController
    {
        //private readonly ITextWriter textWriter = new TextParser(@"C:\Users\Mladjo\Desktop\TaxiService\test.txt");

        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post(User newUser)
        {
            //textWriter.WriteText($"{newUser.Username}, {newUser.Password}");
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
