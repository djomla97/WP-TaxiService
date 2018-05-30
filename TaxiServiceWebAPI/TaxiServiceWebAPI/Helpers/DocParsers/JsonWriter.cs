using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI.Helpers.DocParsers
{
    public class JsonWriter
    {
        private string path = string.Empty;

        public JsonWriter(string path)
        {
            this.path = path;
        }

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
    }
}