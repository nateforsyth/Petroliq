using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Petroliq_API.Application;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using Petroliq_API.Services;
using System.Reflection;
using System.Security.Claims;

namespace Petroliq
{
#pragma warning disable CS1591
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            #region Configure Auth0
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
            #endregion

            #region Configure MongoDB
            builder.Services.Configure<PetroliqDatabaseSettings>(
                builder.Configuration.GetSection("PetroliqDatabase")
            );
            builder.Services.AddSingleton<UserSettingsService>();
            builder.Services.AddSingleton<UserService>();
            #endregion

            #region Configure Swagger/OpenAPI
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
                        Url = new Uri("https://dreamsof.dev/")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Privacy Policy",
                        Url = new Uri("https://dreamsof.dev/privacy/")
                    }
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"<p>JWT Authorization header using the Bearer scheme.</p><p>Enter 'Bearer' [space] and then your token in the text input below.</p><p>Example: '<b>Bearer</b> <i>12345abcdef</i>'</p>",
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

                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });
            #endregion

            builder.Services.AddControllers(opt =>
            {
                opt.Filters.Add<HttpResponseExceptionFilter>();
            })
                .AddJsonOptions(
                    options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

            var app = builder.Build();

            app.UseAuthentication();
            app.UseAuthorization();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/error");
            }
            else
            {
                app.UseExceptionHandler("/error-development");
            }

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
#pragma warning restore CS1591
}
