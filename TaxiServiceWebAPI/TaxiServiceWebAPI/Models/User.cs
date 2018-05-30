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
        public Roles Role { get; set; } = Roles.Customer;
        public List<Ride> Rides { get; set; }

        public User() { }
    }
}