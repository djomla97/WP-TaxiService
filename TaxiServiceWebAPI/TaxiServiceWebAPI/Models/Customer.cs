using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Customer : User
    {

        public bool IsBanned { get; set; }
        public Customer()
        {
            this.Role = Roles.Customer.ToString(); // vec je default
            IsBanned = false;
        }
    }
}