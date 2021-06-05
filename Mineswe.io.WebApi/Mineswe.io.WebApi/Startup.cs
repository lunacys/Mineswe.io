using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Mineswe.io.WebApi.Configurations;
using Mineswe.io.WebApi.Configurations.SwaggerFilters;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Services;

namespace Mineswe.io.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.

        public void ConfigureServices(IServiceCollection services)
        {
            string dbConnectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<MinesweioContext>(options => options.UseSqlServer(dbConnectionString));

            IConfigurationSection appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var key = Encoding.ASCII.GetBytes(appSettingsSection.GetValue<string>("Secret"));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = AppVersionInfo.AppName + " " + AppVersionInfo.BuildVersion,
                    ValidAudience = "Mineswe.IO"
                };
            });

            services.AddCors();
            services
                .AddControllers()
                .AddNewtonsoftJson();

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.Strict;
                options.HttpOnly = HttpOnlyPolicy.Always;
            });

            services.AddSwaggerGen(c =>
            {
                c.SchemaFilter<HideDocumentFilter>();
                c.DocumentFilter<HideDocumentFilter>();
                c.SwaggerDoc(AppVersionInfo.OpenApiInfo.Version, AppVersionInfo.OpenApiInfo);
                c.IncludeXmlComments(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "swagger.xml"));
            });
            
            services.AddSpaStaticFiles(options =>
            {
                options.RootPath = "../../mineswe.io/dist/minesweio";
            });


            services.AddScoped<ITokenGenerator, TokenGenerator>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPasswordHasherService, PasswordHasherService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint($"/swagger/{AppVersionInfo.OpenApiInfo.Version}/swagger.json", $"Mineswe.io.WebApi {AppVersionInfo.BuildVersion}"));
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseDefaultFiles();

            app.UseRouting();
            app.UseCors(builder => builder.WithOrigins("http://localhost:4200"));

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Xss-Protection", "1"); // XSS Protection
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff"); // No Sniff Protection
                context.Response.Headers.Add("X-Frame-Options", "DENY"); // Deny Frame Protection
                await next();
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (env.IsProduction())
            {
                app.UseStaticFiles();
                app.UseSpaStaticFiles();
            }

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../../mineswe.io";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
