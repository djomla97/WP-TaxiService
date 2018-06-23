using System;

namespace TaxiServiceWebAPI.Models
{
    public class FilterOptions
    {
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public int minRating { get; set; }
        public int maxRating { get; set; }
        public double minFare { get; set; }
        public double maxFare { get; set; }

        public string driverFirstName { get; set; }
        public string driverLastName { get; set; }
        public string userFirstName { get; set; }
        public string userLastName { get; set; }

        public FilterOptions() { }
    }
}