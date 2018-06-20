using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiServiceWebAPI.Models
{
    public class Options
    {
        public string Comment { get; set; }
        public int RideMark { get; set; }
        public Location Location { get; set; }
    }
}