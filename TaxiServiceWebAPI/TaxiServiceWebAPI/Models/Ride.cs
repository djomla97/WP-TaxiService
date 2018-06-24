using Newtonsoft.Json;
using System;
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Ride
    {
        public int ID { get; set; }
        public DateTime DateAndTime { get; set; }
        public Location StartLocation { get; set; }
        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Vehicle RideVehicle { get; set; }

        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Customer RideCustomer { get; set; }

        public Location Destination { get; set; }

        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Dispatcher RideDispatcher { get; set; }

        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Driver RideDriver { get; set; }

        public double Fare { get; set; }

        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Comment RideComment { get; set; }

        public string StatusOfRide { get; set; }

        public Ride()
        {
            this.RideVehicle = new Vehicle() { };
            this.RideComment = new Comment();
        }

    }
}