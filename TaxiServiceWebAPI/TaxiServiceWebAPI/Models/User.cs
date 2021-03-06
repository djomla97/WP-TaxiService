﻿using Newtonsoft.Json;
using System.Collections.Generic;
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JMBG { get; set; }
        public string ContactPhone { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } = Roles.Customer.ToString();
        public string Gender { get; set; }

        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public List<Ride> Rides { get; set; }

        public User() { }
    }
}