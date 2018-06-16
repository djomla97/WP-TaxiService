using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TaxiServiceWebAPI.Helpers;

namespace TaxiServiceWebAPI.Models
{
    public class Comment
    {
        public string Description { get; set; }
        public DateTime DateAndTime { get; set; }
        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public User CommentUser { get; set; }
        [JsonProperty(ReferenceLoopHandling = ReferenceLoopHandling.Ignore, IsReference = true)]
        public Ride CommentRide { get; set; }
        public RideMarks RideMark { get; set; }

        public Comment() { }

    }
}