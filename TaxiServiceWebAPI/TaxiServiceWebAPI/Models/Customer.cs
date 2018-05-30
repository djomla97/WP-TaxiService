using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Customer : User
    {
        public Customer()
        {
            this.Role = Roles.Customer; // vec je default
        }
    }
}