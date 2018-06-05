using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using TaxiServiceWebAPI.Models;
using System.Linq;
using System;

namespace TaxiServiceWebAPI.Helpers.DocParsers
{
    public class JSONParser
    {
        private string path = string.Empty;

        public JSONParser(string path)
        {
            this.path = path;
        }

        /// <summary>
        ///     Writes a single user into the specified .json file
        /// </summary>
        /// <param name="userData">user that should be saved</param>
        public void WriteUser(User userData)
        {
            if (!File.Exists(path))
            {
                var fileCreate = File.CreateText(path);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(path);

            var list = JsonConvert.DeserializeObject<List<User>>(jsonData) ?? new List<User>();

            // doda novog
            list.Add(userData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(path, jsonData);

        }

        /// <summary>
        ///     Writes a single ride into the specified .json file
        /// </summary>
        /// <param name="rideData">ride that should be saved</param>
        public Ride WriteRide(Ride rideData)
        {
            if (!File.Exists(path))
            {
                var fileCreate = File.CreateText(path);
                fileCreate.Close();
            }

            // cita json
            var jsonData = File.ReadAllText(path);

            var list = JsonConvert.DeserializeObject<List<Ride>>(jsonData) ?? new List<Ride>();

            bool existsID = false;
            Random rand = new Random();

            do
            {
                existsID = false;
                rideData.ID = rand.Next(500, 3000);
                foreach (var ride in list)
                {
                    if (ride.ID == rideData.ID)
                        existsID = true;
                }
            } while (existsID == true);

            // doda novog
            list.Add(rideData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(list, Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(path, jsonData);

            return rideData;
        }


        /// <summary>
        ///     Reads from a .json file for Users
        /// </summary>
        /// <returns>List of all users in specified file</returns>
        public List<User> ReadUsers()
        {
            List<User> users = new List<User>();            

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();

                users = JsonConvert.DeserializeObject<List<User>>(json);                
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

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
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

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
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

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
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
        public void EditUser(string oldUsername, User newUser)
        {
            List<User> users = new List<User>();

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                users = JsonConvert.DeserializeObject<List<User>>(json);
            }

            User oldUser = users.Where(u => u.Username.ToLower().Equals(oldUsername.ToLower())).First();
            newUser.Rides = oldUser.Rides;
            // jer ponisti zbog default-a klase User + nigde se ne prosledi sa forme Rola
            newUser.Role = oldUser.Role; 

            // ako ne izmeni sifru
            if (newUser.Password == null || newUser.Password == string.Empty)
                newUser.Password = oldUser.Password;
                
            // zamenimo ih samo
            users.Remove(oldUser);
            users.Add(newUser);

            var jsonData = JsonConvert.SerializeObject(users, Formatting.Indented);

            File.WriteAllText(path, jsonData);
        }


        /// <summary>
        ///     Edits driver information
        /// </summary>
        /// <param name="oldUsername">Username of driver to be edited</param>
        /// <param name="newUser">New driver to replace the old one</param>
        public void EditDriver(string oldUsername, Driver newUser)
        {
            List<Driver> users = new List<Driver>();

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
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

            var jsonData = JsonConvert.SerializeObject(users, Formatting.Indented);

            File.WriteAllText(path, jsonData);
        }

        /// <summary>
        ///     Edits ride information
        /// </summary>
        /// <param name="id">ID of driver to be edited</param>
        /// <param name="newRide">New ride to replace the old one</param>
        public void EditRide(int id, Ride newRide)
        {
            List<Ride> rides = new List<Ride>();

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                rides = JsonConvert.DeserializeObject<List<Ride>>(json);
            }

            Ride oldRide = rides.Where(r => r.ID == id).First();

            // zamenimo ih samo
            rides.Remove(oldRide);
            rides.Add(newRide);

            var jsonData = JsonConvert.SerializeObject(rides, Formatting.Indented);

            File.WriteAllText(path, jsonData);
        }

        /// <summary>
        ///     Deletes a ride with id from .json file
        /// </summary>
        /// <param name="id">id of ride to remove</param>
        public void DeleteRide(int id)
        {
            List<Ride> rides = new List<Ride>();

            if (!File.Exists(path))
            {
                var file = File.Create(path);
                file.Close();
            }

            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                rides = JsonConvert.DeserializeObject<List<Ride>>(json);
            }

            Ride rideToRemove = rides.Where(r => r.ID == id).First();

            // zamenimo ih samo
            rides.Remove(rideToRemove);

            var jsonData = JsonConvert.SerializeObject(rides, Formatting.Indented);

            File.WriteAllText(path, jsonData);
        }

    }
}