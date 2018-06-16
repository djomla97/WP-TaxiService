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
            InitializeDrivers();
            InitializeDemoUser();
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
                Role = Roles.Dispatcher.ToString(),
                Gender = Genders.Male.ToString(),
                Rides = new List<Ride>()
            });

            JSONParser jsonParser = new JSONParser();

            foreach (var admin in admins)
                jsonParser.WriteAdmin(admin);

            // stavimo read-only na file, da ne moze da se menja
            //File.SetAttributes(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\data\admins.json", FileAttributes.ReadOnly);

        }

        private void InitializeDrivers()
        { 
            List<Driver> drivers = new List<Driver>();
           
            drivers.Add(new Driver()
            {
                Username = "driver",
                FirstName = "Mile",
                LastName = "Vozac",
                Password = "driver",
                Email = "driver@taxiservice.com",
                ContactPhone = "+3816541653",
                JMBG = "32165481522",
                Role = Roles.Driver.ToString(),
                Gender = Genders.Male.ToString(),
                DriverLocation = new Location() { X = 0, Y = 0, LocationAddress = new Address("Bulevar Oslobodjenja", "NoviSad", "21000") },
                Rides = new List<Ride>()
            });

            JSONParser jsonParser = new JSONParser();

            foreach (var driver in drivers)
                jsonParser.WriteDriver(driver);

        }

        private void InitializeDemoUser()
        {
            List<Customer> users = new List<Customer>();
            JSONParser jsonParser = new JSONParser();
            
            JSONParser jsonParserRides = new JSONParser();

            List<Ride> rides = new List<Ride>();

            try
            {                
                rides = jsonParserRides.ReadRides()
                    .Where(r => r.RideCustomer.Username.ToLower().Equals("demo".ToLower()) && r.StatusOfRide != RideStatuses.CANCELED.ToString()).ToList();
            }
            catch (Exception)
            {
                rides = new List<Ride>();
            }

            users.Add(new Customer()
            {
                Username = "demo",
                FirstName = "Demo",
                LastName = "User",
                Password = "demo",
                Email = "demo@taxiservice.com",
                ContactPhone = "+386895111",
                JMBG = "445556978112",
                Role = Roles.Customer.ToString(),
                Gender = Genders.Male.ToString(),
                Rides = rides
            });

            foreach (var user in users)
                jsonParser.WriteUser(user);

            jsonParserRides = null;
        }

    }
}
