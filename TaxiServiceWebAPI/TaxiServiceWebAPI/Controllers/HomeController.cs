using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TaxiServiceWebAPI.Models;

namespace TaxiServiceWebAPI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            User newUser = new User();

            return View();
        }
    }
}
