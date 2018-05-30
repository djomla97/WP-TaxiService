namespace TaxiServiceWebAPI.Models
{
    public class Address
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }

        public Address(string street, string city, string zip)
        {
            this.Street = street;
            this.City = city;
            this.ZipCode = zip;
        }

        public Address() { }

    }
}