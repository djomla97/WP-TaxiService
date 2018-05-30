using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Dispatcher : User
    {
        public Dispatcher()
        {
            this.Role = Roles.Dispatcher;
        }

    }
}