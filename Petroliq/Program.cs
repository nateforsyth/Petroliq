using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Petroliq_API.Application;
using Petroliq_API.Authorisation;
using Petroliq_API.Model;
using Petroliq_API.Services;
using System.Reflection;
using System.Text;

namespace Petroliq
{
#pragma warning disable CS1591
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            IConfigurationSection authSettings = builder.Configuration.GetSection("Auth");
            builder.Services.Configure<AuthSettings>(
                authSettings
            );

            builder.Services.AddCors(opt =>
            {
                opt.AddPolicy("_Auth", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:3000",
                            "https://petroliq.dreamsof.dev",
                            "https://petroliq.dreamsof.dev/api"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
                });
            });

            #region Configure Auth
            string? jwtIssuer = string.Empty;
            string? jwtKey = string.Empty;
            string? jwtAudience = string.Empty;
#if !DEBUG
            // from appsettings.json, for IIS usage
            jwtIssuer = authSettings.GetSection("Issuer").Value; // builder.Configuration["Auth:Issuer"];
            jwtKey = authSettings.GetSection("Key").Value;
            jwtAudience = authSettings.GetSection("Audience").Value;
#else
            // from secrets.json, inaccessible when hosted on IIS
            jwtIssuer = builder.Configuration["Auth:Issuer"];
            jwtKey = builder.Configuration["AuthKey"];
            jwtAudience = builder.Configuration["Auth:Audience"];
#endif

            if (!string.IsNullOrEmpty(jwtIssuer) && !string.IsNullOrEmpty(jwtKey) && !string.IsNullOrEmpty(jwtAudience))
            {
                builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtIssuer,
                        ValidAudience = jwtAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Authority = jwtIssuer;
                });

                builder.Services.AddAuthorization(options =>
                {
                    options.AddPolicy("admin", policy => policy.Requirements.Add(new HasRoleRequirement(jwtIssuer, ["administrator"])));
                    options.AddPolicy("userAdmin", policy => policy.Requirements.Add(new HasRoleRequirement(jwtIssuer, ["administrator", "users.read", "users.write", "userSettings.read", "userSettings.write"])));
                    options.AddPolicy("appUser", policy => policy.Requirements.Add(new HasRoleRequirement(jwtIssuer, ["appUser", "administrator", "users.read", "users.write", "userSettings.read", "userSettings.write"])));
                });

                builder.Services.AddSingleton<IAuthorizationHandler, HasRoleHandler>();
            }
            #endregion

            builder.Services.AddControllers();

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

                options.UseInlineDefinitionsForEnums();

                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "Using the Authorization header with the Bearer scheme.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                options.AddSecurityDefinition("Bearer", securitySchema);

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { securitySchema, new[] { "Bearer" } }
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

            builder.Services.AddHttpContextAccessor();

            var app = builder.Build();

            app.UseCors("_Auth");

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
