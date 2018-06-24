using Newtonsoft.Json;
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Driver : User
    {
        public Location DriverLocation { get; set; }
        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Vehicle DriverVehicle { get; set; }
        public bool IsFree { get; set; }
        public bool IsBanned { get; set; }

        public Driver()
        {
            this.Role = Roles.Driver.ToString();
            IsFree = true;
            IsBanned = false;
        }

    }
}