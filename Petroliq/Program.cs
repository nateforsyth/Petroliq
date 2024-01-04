using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Petroliq_API.Model;
using Petroliq_API.Services;
using System.Reflection;

namespace Petroliq
{
    /*
     * https://www.mongodb.com/try/download/community?tck=docs_server
     * https://www.mongodb.com/try/download/community
     * 
     * https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-8.0&tabs=visual-studio
     * 
     * https://www.pragimtech.com/blog/mongodb-tutorial/asp-net-6-rest-api-tutorial/
     * 
     * https://stackoverflow.com/questions/41615574/mongodb-server-has-startup-warnings-access-control-is-not-enabled-for-the-dat
     * https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password
     * 
     * https://www.mongodb.com/community/forums/t/connection-refused-for-remote-access-of-mongodb-server/235790
     * 
     * https://stackoverflow.com/questions/33632409/allow-mongodb-remote-access-for-specific-ip
     * 
     * ASP.NET Core data annotations
     * https://levelup.gitconnected.com/20-important-data-annotations-in-asp-net-core-mvc-f0935dd91661
     */

#pragma warning disable CS1591
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // configure MongoDB
            builder.Services.Configure<PetroliqDatabaseSettings>(
                builder.Configuration.GetSection("PetroliqDatabase")
            );
            builder.Services.AddSingleton<UserSettingsService>();
            builder.Services.AddSingleton<UserService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Petroliq API",
                    Description = "An ASP.NET Core Web API interfacing with the Petroliq service",
                    TermsOfService = new Uri("https://dreamsof.dev/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Dreamsof.dev",
                        Url = new Uri("https://dreamsof.dev/t")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Privacy Policy",
                        Url = new Uri("https://dreamsof.dev/privacy/")
                    }
                });

                // using System.Reflection;
                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });

            builder.Services.AddControllers()
                .AddJsonOptions(
                    options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
#pragma warning restore CS1591
}
