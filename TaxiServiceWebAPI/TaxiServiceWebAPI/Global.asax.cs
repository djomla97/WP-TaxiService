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
            List<Dispatcher> newAdmins = new List<Dispatcher>();

            newAdmins.Add(new Dispatcher()
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

            var admins = jsonParser.ReadDispatchers();
            foreach (var admin in newAdmins)
            {
                if (admins != null)
                {
                    bool exists = false;
                    foreach (var existAdmin in admins)
                    {
                        if (admin.Username == existAdmin.Username)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                        jsonParser.WriteAdmin(admin);
                }
                else
                {
                    jsonParser.WriteAdmin(admin);
                }
            }

        }

        private void InitializeDrivers()
        { 
            List<Driver> newDrivers = new List<Driver>();

            newDrivers.Add(new Driver()
            {
                Username = "toretto",
                FirstName = "Dominic",
                LastName = "Toretto",
                Password = "dom",
                Email = "fast@furious.com",
                ContactPhone = "+3816541653",
                JMBG = "32165481522",
                Role = Roles.Driver.ToString(),
                Gender = Genders.Male.ToString(),
                DriverLocation = new Location() { X = 45.2544675, Y = 19.8350986, LocationAddress = new Address("Bulevar Oslobodjenja 66a", "Novi Sad", "21000") },
                Rides = new List<Ride>(),
                DriverVehicle = new Vehicle() { NumberOfRegistration="TAXI-055-442", TaxiNumber="250", VehicleAge=2018, VehicleType=VehicleTypes.Passenger.ToString() }
            });

            newDrivers[0].DriverVehicle.CarDriver = newDrivers[0];

            newDrivers.Add(new Driver()
            {
                Username = "driver",
                FirstName = "John",
                LastName = "Doe",
                Password = "driver",
                Email = "fx@driver.com",
                ContactPhone = "+32558612",
                JMBG = "22553615844",
                Role = Roles.Driver.ToString(),
                Gender = Genders.Male.ToString(),
                DriverLocation = new Location() { X = 45.2411468, Y = 19.8074008, LocationAddress = new Address("Bulevar Patrijarha Pavla", "Novi Sad", "21102") },
                Rides = new List<Ride>(),
                DriverVehicle = new Vehicle() { NumberOfRegistration = "TAXI-592-123", TaxiNumber = "3655", VehicleAge = 2015, VehicleType = VehicleTypes.Van.ToString() }
            });

            newDrivers[1].DriverVehicle.CarDriver = newDrivers[1];

            JSONParser jsonParser = new JSONParser();

            var drivers = jsonParser.ReadDrivers();
            foreach (var driver in newDrivers)
            {
                if (drivers != null)
                {
                    bool exists = false;
                    foreach (var existsDriver in drivers)
                    {
                        if (driver.Username == existsDriver.Username)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                        jsonParser.WriteDriver(driver);
                }
                else
                {
                    jsonParser.WriteDriver(driver);
                }
            }

        }

        private void InitializeDemoUser()
        {
            List<Customer> newUsers = new List<Customer>();
            JSONParser jsonParser = new JSONParser();     
            List<Ride> rides = new List<Ride>();

            try
            {                
                rides = jsonParser.ReadRides()
                    .Where(r => r.RideCustomer.Username.ToLower().Equals("demo".ToLower()) && r.StatusOfRide != RideStatuses.CANCELED.ToString()).ToList();
            }
            catch (Exception)
            {
                rides = new List<Ride>();
            }

            newUsers.Add(new Customer()
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

            var users = jsonParser.ReadUsers();
            foreach (var user in newUsers)
            {
                if (users != null)
                {
                    bool exists = false;
                    foreach (var existsDriver in users)
                    {
                        if (user.Username == existsDriver.Username)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                        jsonParser.WriteUser(user);
                }
                else
                {
                    jsonParser.WriteUser(user);
                }
            }

        }

    }
}
