using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace TaxiServiceWebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // za cors
            //var cors = new EnableCorsAttribute("http://localhost:8080", "*", "*");
            //config.EnableCors(cors);

            // Route to index.html
            config.Routes.MapHttpRoute(
                name: "Index",
                routeTemplate: "{id}.html",
                defaults: new { id = "index" });


            // https://stackoverflow.com/questions/11407267/multiple-httppost-method-in-web-api-controller

            // Controller Only
            // To handle routes like `/api/VTRouting`
            config.Routes.MapHttpRoute(
                name: "ControllerOnly",
                routeTemplate: "api/{controller}"
            );

            // Controller with ID
            // To handle routes like `/api/VTRouting/1`
            config.Routes.MapHttpRoute(
                name: "ControllerAndId",
                routeTemplate: "api/{controller}/{id}",
                defaults: null,
                constraints: new { id = @"^\d+$" } // Only integers 
            );

            // Controllers with Actions
            // To handle routes like `/api/VTRouting/route`
            config.Routes.MapHttpRoute(
                name: "ControllerAndAction",
                routeTemplate: "api/{controller}/{action}"
            );


            // sa vezbi
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));



        }
    }
}
