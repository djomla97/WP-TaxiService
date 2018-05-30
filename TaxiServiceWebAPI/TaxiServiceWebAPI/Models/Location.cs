namespace TaxiServiceWebAPI.Models
{
    public class Location
    {
        public double X { get; set; }
        public double Y { get; set; }
        public Address LocationAddress { get; set; }
    }
}