using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Petroliq_API.Model;
using Petroliq_API.Services;
using System.Reflection;
using System.Security.Claims;

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

            // configure Auth0

            var domain = $"{builder.Configuration["Auth0:Domain"]}";
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = builder.Configuration["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("read:users", policy => policy.Requirements.Add(new HasScopeRequirement("read:users", domain)));
                options.AddPolicy("read:userSettings", policy => policy.Requirements.Add(new HasScopeRequirement("read:userSettings", domain)));
                options.AddPolicy("write:users", policy => policy.Requirements.Add(new HasScopeRequirement("write:users", domain)));
                options.AddPolicy("write:userSettings", policy => policy.Requirements.Add(new HasScopeRequirement("write:userSettings", domain)));
                options.AddPolicy("calculate", policy => policy.Requirements.Add(new HasScopeRequirement("calculate", domain)));
            });

            builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

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

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                                {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                                },
                                Scheme = "oauth2",
                                Name = "Bearer",
                                In = ParameterLocation.Header,
                        },
                        new List<string>()
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

            app.UseAuthentication();
            app.UseAuthorization();

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
