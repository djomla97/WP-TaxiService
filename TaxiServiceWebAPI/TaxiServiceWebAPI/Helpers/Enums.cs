using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiServiceWebAPI.Helpers
{
    public enum Roles
    {
        Customer,
        Dispatcher,
        Driver
    }

    public enum RideStatuses
    {
        CREATED_ONWAIT,
        FORMED,
        PROCESSED,
        ACCEPTED,
        CANCELED,
        FAILED,
        SUCCESSFUL
    }

    public enum VehicleTypes
    {
        Passenger,
        Van
    }

    public enum RideMarks
    {
        ZERO = 0,
        ONE = 1,
        TWO = 2,
        THREE = 3,
        FOUR = 4,
        FIVE = 5
    }

    public enum Genders
    {
        Male,
        Female
    }

}