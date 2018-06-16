using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using TaxiServiceWebAPI.Models;
using System.Linq;
using System;
using System.Xml;

namespace TaxiServiceWebAPI.Helpers.DocParsers
{
    public class JSONParser
    {
        private string usersPath = string.Empty;
        private string driversPath = string.Empty;
        private string adminsPath = string.Empty;
        private string ridesPath = string.Empty;

        public JSONParser()
        {
            ReadConfig();
        }

        /// <summary>
        ///     Reads from a config.xml file for data paths
        /// </summary>
        private void ReadConfig()
        {
            XmlDocument configXml = new XmlDocument();
            configXml.Load(@"C:\Users\Mladjo\Desktop\TaxiService\WP-TaxiService\TaxiServiceWebAPI\TaxiServiceWebAPI\Helpers\readerConfig.xml");

            usersPath = configXml.SelectSingleNode("/config/userDataPath").InnerText;
            driversPath = configXml.SelectSingleNode("/config/driverDataPath").InnerText;
            adminsPath = configXml.SelectSingleNode("/config/adminDataPath").InnerText;
            ridesPath = configXml.SelectSingleNode("/config/rideDataPath").InnerText;
        }

        /// <summary>
        ///     Writes a single user into the specified .json file
        /// </summary>
        /// <param name="userData">user that should be saved</param>
        public void WriteUser(Customer userData)
        {
            if (!File.Exists(usersPath))
            {
                var fileCreate = File.CreateText(usersPath);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(usersPath);

            var list = JsonConvert.DeserializeObject<List<Customer>>(jsonData) ?? new List<Customer>();

            if(userData.Rides == null)
            {
                userData.Rides = new List<Ride>();
            }

            // doda novog
            list.Add(userData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(usersPath, jsonData);
        }

        /// <summary>
        ///     Writes a single driver into the specified .json file
        /// </summary>
        /// <param name="driverData">driver that should be saved</param>
        public void WriteDriver(Driver driverData)
        {
            if (!File.Exists(driversPath))
            {
                var fileCreate = File.CreateText(driversPath);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(driversPath);

            var list = JsonConvert.DeserializeObject<List<Driver>>(jsonData) ?? new List<Driver>();

            if (driverData.Rides == null)
            {
                driverData.Rides = new List<Ride>();
            }

            // doda novog
            list.Add(driverData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(driversPath, jsonData);
        }

        /// <summary>
        ///     Writes a single admin into the specified .json file
        /// </summary>
        /// <param name="adminData">admin that should be saved</param>
        public void WriteAdmin(Dispatcher adminData)
        {
            if (!File.Exists(adminsPath))
            {
                var fileCreate = File.CreateText(adminsPath);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(adminsPath);

            var list = JsonConvert.DeserializeObject<List<Dispatcher>>(jsonData) ?? new List<Dispatcher>();

            if (adminData.Rides == null)
            {
                adminData.Rides = new List<Ride>();
            }

            // doda novog
            list.Add(adminData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(adminsPath, jsonData);
        }

        /// <summary>
        ///     Writes a single ride into the specified .json file
        /// </summary>
        /// <param name="rideData">ride that should be saved</param>
        public Ride WriteRide(Ride rideData)
        {
            if (!File.Exists(ridesPath))
            {
                var fileCreate = File.CreateText(ridesPath);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(ridesPath);

            var list = JsonConvert.DeserializeObject<List<Ride>>(jsonData) ?? new List<Ride>();

            bool existsID = false;
            Random rand = new Random();

            do
            {
                existsID = false;
                rideData.ID = rand.Next(1000, 10000);
                foreach (var ride in list)
                {
                    if (ride.ID == rideData.ID)
                        existsID = true;
                }
            } while (existsID == true);

            // doda novog
            list.Add(rideData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(ridesPath, jsonData);

            return rideData;
        }

        /// <summary>
        ///     Reads from a .json file for Users
        /// </summary>
        /// <returns>List of all users in specified file</returns>
        public List<Customer> ReadUsers()
        {
            List<Customer> users = new List<Customer>();            

            if (!File.Exists(usersPath))
            {
                var file = File.Create(usersPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(usersPath))
            {
                string json = r.ReadToEnd();

                users = JsonConvert.DeserializeObject<List<Customer>>(json);                
            }

            return users;
        }

        /// <summary>
        ///     Reads from a .json file for Rides
        /// </summary>
        /// <returns>List of all rides in specified file</returns>
        public List<Ride> ReadRides()
        {
            List<Ride> rides = new List<Ride>();

            if (!File.Exists(ridesPath))
            {
                var file = File.Create(ridesPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(ridesPath))
            {
                string json = r.ReadToEnd();

                rides = JsonConvert.DeserializeObject<List<Ride>>(json);
            }

            return rides;
        }

        /// <summary>
        ///     Reads from a .json file for Drivers
        /// </summary>
        /// <returns>List of all drivers in specified file</returns>
        public List<Driver> ReadDrivers()
        {
            List<Driver> drivers = new List<Driver>();

            if (!File.Exists(driversPath))
            {
                var file = File.Create(driversPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(driversPath))
            {
                string json = r.ReadToEnd();

                drivers = JsonConvert.DeserializeObject<List<Driver>>(json);
            }

            return drivers;
        }

        /// <summary>
        ///     Reads from a .json file for Dispatchers
        /// </summary>
        /// <returns>List of all drivers in specified file</returns>
        public List<Dispatcher> ReadDispatchers()
        {
            List<Dispatcher> dispatchers = new List<Dispatcher>();

            if (!File.Exists(adminsPath))
            {
                var file = File.Create(adminsPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(adminsPath))
            {
                string json = r.ReadToEnd();

                dispatchers = JsonConvert.DeserializeObject<List<Dispatcher>>(json);
            }

            return dispatchers;
        }

        /// <summary>
        ///     Edits user information
        /// </summary>
        /// <param name="oldUsername">Username of user to be edited</param>
        /// <param name="newUser">New user to replace the old one</param>
        public void EditUser(string oldUsername, Customer newUser)
        {
            List<Customer> users = new List<Customer>();

            if (!File.Exists(usersPath))
            {
                var file = File.Create(usersPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(usersPath))
            {
                string json = r.ReadToEnd();
                users = JsonConvert.DeserializeObject<List<Customer>>(json);
            }

            Customer oldUser = users.Where(u => u.Username.ToLower().Equals(oldUsername.ToLower())).First();

            // jer ponisti zbog default-a klase User + nigde se ne prosledi sa forme Rola
            newUser.Role = oldUser.Role;

            // ako ne izmeni sifru
            if (newUser.Password == null || newUser.Password == string.Empty)
                newUser.Password = oldUser.Password;

            // provera za edit user vs. cancel ride
            if (newUser.Rides == null)
            {
                newUser.Rides = new List<Ride>();
                var allRides = ReadRides();
                foreach(var ride in oldUser.Rides)
                {
                    newUser.Rides.Add(ride);
                    for(int i = 0; i < allRides.Count; i++)
                    {
                        if(allRides[i].ID == ride.ID)
                        {
                            if(newUser.Role == Roles.Customer.ToString())
                            {
                                allRides[i].RideCustomer = newUser;
                                EditRide(allRides[i].ID, allRides[i]);
                            }
                        }
                    }
                }
            }
                
            // zamenimo ih samo
            users.Remove(oldUser);
            users.Add(newUser);

            var jsonData = JsonConvert.SerializeObject(users, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(usersPath, jsonData);
        }

        /// <summary>
        ///     Edits driver information
        /// </summary>
        /// <param name="oldUsername">Username of driver to be edited</param>
        /// <param name="newUser">New driver to replace the old one</param>
        public void EditDriver(string oldUsername, Driver newUser)
        {
            List<Driver> users = new List<Driver>();

            if (!File.Exists(driversPath))
            {
                var file = File.Create(driversPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(driversPath))
            {
                string json = r.ReadToEnd();
                users = JsonConvert.DeserializeObject<List<Driver>>(json);
            }

            Driver oldUser = users.Where(u => u.Username.ToLower().Equals(oldUsername.ToLower())).First();
            newUser.Rides = oldUser.Rides;
            // jer ponisti zbog default-a klase User + nigde se ne prosledi sa forme Rola
            newUser.Role = oldUser.Role;

            // ako ne izmeni sifru
            if (newUser.Password == null || newUser.Password == string.Empty)
                newUser.Password = oldUser.Password;

            // zamenimo ih samo
            users.Remove(oldUser);
            users.Add(newUser);

            var jsonData = JsonConvert.SerializeObject(users, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(driversPath, jsonData);
        }

        /// <summary>
        ///     Edits admin information
        /// </summary>
        /// <param name="oldUsername">Username of admin to be edited</param>
        /// <param name="newUser">New admin to replace the old one</param>
        public void EditDispatcher(string oldUsername, Dispatcher newAdmin)
        {
            List<Dispatcher> admins = new List<Dispatcher>();

            if (!File.Exists(adminsPath))
            {
                var file = File.Create(adminsPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(adminsPath))
            {
                string json = r.ReadToEnd();
                admins = JsonConvert.DeserializeObject<List<Dispatcher>>(json);
            }

            Dispatcher oldAdmin = admins.Where(u => u.Username.ToLower().Equals(oldUsername.ToLower())).First();

            // provera za edit user vs. cancel ride
            if (newAdmin.Rides == null)
            {
                newAdmin.Rides = new List<Ride>();
                foreach (var ride in oldAdmin.Rides)
                {
                    newAdmin.Rides.Add(ride);
                }
            }

            // jer ponisti zbog default-a klase User + nigde se ne prosledi sa forme Rola
            newAdmin.Role = oldAdmin.Role;

            // ako ne izmeni sifru
            if (newAdmin.Password == null || newAdmin.Password == string.Empty)
                newAdmin.Password = oldAdmin.Password;

            // zamenimo ih samo
            admins.Remove(oldAdmin);
            admins.Add(newAdmin);

            var jsonData = JsonConvert.SerializeObject(admins, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(adminsPath, jsonData);
        }

        /// <summary>
        ///     Edits ride information
        /// </summary>
        /// <param name="id">ID of driver to be edited</param>
        /// <param name="newRide">New ride to replace the old one</param>
        public void EditRide(int id, Ride newRide)
        {
            List<Ride> rides = new List<Ride>();

            if (!File.Exists(ridesPath))
            {
                var file = File.Create(ridesPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(ridesPath))
            {
                string json = r.ReadToEnd();
                rides = JsonConvert.DeserializeObject<List<Ride>>(json);
            }

            Ride oldRide = rides.Where(r => r.ID == id).First();
            newRide.ID = oldRide.ID;
            if(newRide.StatusOfRide == RideStatuses.CREATED_ONWAIT.ToString() || newRide.StatusOfRide == null)
                newRide.StatusOfRide = oldRide.StatusOfRide;

            // zamenimo ih samo
            rides.Remove(oldRide);
            rides.Add(newRide);

            var jsonData = JsonConvert.SerializeObject(rides, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(ridesPath, jsonData);
        }
 
        /// <summary>
        ///     Deletes a ride with id from .json file
        /// </summary>
        /// <param name="id">id of ride to remove</param>
        public void DeleteRide(int id)
        {
            List<Ride> rides = new List<Ride>();

            if (!File.Exists(ridesPath))
            {
                var file = File.Create(ridesPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(ridesPath))
            {
                string json = r.ReadToEnd();
                rides = JsonConvert.DeserializeObject<List<Ride>>(json);
            }

            Ride rideToRemove = rides.Where(r => r.ID == id).First();

            // zamenimo ih samo
            rides.Remove(rideToRemove);

            var jsonData = JsonConvert.SerializeObject(rides, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(ridesPath, jsonData);
        }

        /// <summary>
        ///     Deletes a ride from user when cancelled or forbidden by user/dispatcher
        /// </summary>
        /// <param name="user">user from whom we remove the ride</param>
        /// <param name="ride">ride to be removed</param>
        public void DeleteRideFromUser(Customer user, Ride ride)
        {
            var rideToRemove = user.Rides.Where(r => r.ID == ride.ID).First();
            user.Rides.Remove(rideToRemove);

            // update korisnika
            List<Customer> users = new List<Customer>();

            if (!File.Exists(usersPath))
            {
                var file = File.Create(usersPath);
                file.Close();
            }

            using (StreamReader r = new StreamReader(usersPath))
            {
                string json = r.ReadToEnd();
                users = JsonConvert.DeserializeObject<List<Customer>>(json);
            }

            Customer oldUser = users.Where(u => u.Username.Equals(user.Username)).First();

            users.Remove(oldUser);
            users.Add(user);

            var jsonData = JsonConvert.SerializeObject(users, Newtonsoft.Json.Formatting.Indented);

            File.WriteAllText(usersPath, jsonData);


        }

    }
}