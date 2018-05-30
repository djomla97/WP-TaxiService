using System;
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Ride
    {
        public DateTime DateAndTime { get; set; }
        public Location StartLocation { get; set; }
        public Vehicle RideVehicle { get; set; }
        public Customer RideCustomer { get; set; }
        public Location Destination { get; set; }
        public Dispatcher RideDispatcher { get; set; }
        public Driver RideDriver { get; set; }
        public double Fare { get; set; }
        public string Comment { get; set; }
        public RideStatuses StatusOfRide { get; set; }

        public Ride()
        {
            this.RideVehicle = new Vehicle() {};
        }

    }
}