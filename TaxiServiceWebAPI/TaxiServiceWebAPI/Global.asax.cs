using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
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
                Rides = new List<Ride>() 
            });

            JSONParser jsonParser = new JSONParser(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\admins.json");

            foreach (var admin in admins)
                jsonParser.WriteUser(admin);


    }

    }
}
