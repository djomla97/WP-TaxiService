using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Driver : User
    {
        public Location DriverLocation { get; set; }
        public Vehicle DriverVehicle { get; set; }

        public Driver()
        {
            this.Role = Roles.Driver;
        }

    }
}