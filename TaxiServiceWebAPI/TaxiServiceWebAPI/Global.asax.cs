using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using TaxiServiceWebAPI.Helpers;
using TaxiServiceWebAPI.Helpers.DocParsers;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            InitializeAdmins();
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        private void InitializeAdmins()
        {
            // ne zelimo vise puta iste admine da unosi
            if (File.Exists(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json"))
                File.Delete(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");

            List<Dispatcher> admins = new List<Dispatcher>();

            admins.Add(new Dispatcher()
            {
                Username = "supermladen",
                FirstName = "Mladen",
                LastName = "Milosevic",
                Password = "admin",
                Email = "mladjo@taxiservice.com",
                ContactPhone = "+3816541653",
                JMBG = "123456789321654",
                Gender = Genders.Male.ToString(),
                Rides = new List<Ride>() 
            });

            JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json");

            foreach (var admin in admins)
                jsonParser.WriteUser(admin);

            // stavimo read-only na file, da ne moze da se menja
            //File.SetAttributes(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json", FileAttributes.ReadOnly);

    }

    }
}
