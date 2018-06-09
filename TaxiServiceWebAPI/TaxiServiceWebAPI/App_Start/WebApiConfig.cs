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

            // self referencing loop fix 
            // https://stackoverflow.com/questions/7397207/json-net-error-self-referencing-loop-detected-for-type
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Serialize;
            config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;

            // Route to index.html
            config.Routes.MapHttpRoute(
                name: "Index",
                routeTemplate: "{id}.html",
                defaults: new { id = "index" });


            config.Routes.MapHttpRoute(
                name: "UserApi",
                routeTemplate: "api/{controller}/{username}",
                defaults: new { username = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "ApiWithID",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // sa vezbi
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));



        }
    }
}
