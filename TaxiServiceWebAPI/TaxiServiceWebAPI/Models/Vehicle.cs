using Newtonsoft.Json;

namespace TaxiServiceWebAPI.Models
{
    public class Vehicle
    {
        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Driver CarDriver { get; set; }
        public int VehicleAge { get; set; }
        public string NumberOfRegistration { get; set; }
        public string TaxiNumber { get; set; }
        public string VehicleType { get; set; }

        public Vehicle() { }

    }
}