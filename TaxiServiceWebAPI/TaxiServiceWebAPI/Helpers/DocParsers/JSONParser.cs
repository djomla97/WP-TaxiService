using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using TaxiServiceWebAPI.Models;

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

            // zatim u listu pretvori
            var employeeList = JsonConvert.DeserializeObject<List<User>>(jsonData) ?? new List<User>();

            // doda novog
            employeeList.Add(userData);

            // zatim u Json pretvori listu, jer nam treba niz
            jsonData = JsonConvert.SerializeObject(employeeList, Formatting.Indented);

            // i onda upise u .json
            File.WriteAllText(path, jsonData);

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

    }
}