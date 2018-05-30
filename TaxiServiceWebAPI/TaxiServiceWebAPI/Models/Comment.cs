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
        public User CommentUser { get; set; }
        public Ride CommentRide { get; set; }
        public RideMarks RideMark { get; set; }

        public Comment() { }

    }
}