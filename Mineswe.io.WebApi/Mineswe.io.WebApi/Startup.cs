using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Mineswe.io.WebApi.Configurations;
using Mineswe.io.WebApi.Data;
using Mineswe.io.WebApi.Hubs;
using Mineswe.io.WebApi.Services;
using Mineswe.io.WebApi.Services.Authentication;

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

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(opt =>
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

                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/testHub"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddCors(options =>
            {
                options.AddPolicy("Mineswe.IO Policy", builder =>
                {
                    builder.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });

            services.AddControllersWithViews().AddNewtonsoftJson();
            //services.AddControllers().AddNewtonsoftJson();

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.Strict;
                options.HttpOnly = HttpOnlyPolicy.Always;
            });

            services.AddSwaggerGen(c =>
            {
                //c.SchemaFilter<HideDocumentFilter>();
                //c.DocumentFilter<HideDocumentFilter>();
                c.SwaggerDoc(AppVersionInfo.OpenApiInfo.Version, AppVersionInfo.OpenApiInfo);
                c.IncludeXmlComments(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "swagger.xml"));
            });

            //services.AddControllersWithViews().AddNewtonsoftJson();

            services.AddSpaStaticFiles(options =>
            {
                options.RootPath = "../../mineswe.io/dist/minesweio";
            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            //services.AddMvc(options => options.EnableEndpointRouting = false);

            services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
            services.AddScoped<IPasswordHasherService, PasswordHasherService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthSerivce, AuthService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/Error");
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint($"/swagger/{AppVersionInfo.OpenApiInfo.Version}/swagger.json", $"Mineswe.io.WebApi {AppVersionInfo.BuildVersion}"));
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseDefaultFiles();

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    string originalPath = context.Request.Path.Value;
                    context.Items["originalPath"] = originalPath;
                    context.Request.Path = "/Error";
                    await next();
                }
                    
            });

            app.UseRouting();
            app.UseCors("Mineswe.IO Policy");

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Xss-Protection", "1"); // XSS Protection
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff"); // No Sniff Protection
                context.Response.Headers.Add("X-Frame-Options", "DENY"); // Deny Frame Protection
                await next();
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute("default", "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<TestHub>("/testHub");
            });

            /*app.Run(context =>
            {
                if (context.Request.)
                context.Response.WriteAsJsonAsync(new {Message = "Invalid URL"});
            });*/


            //app.UseStatusCodePages();
            var useProxy = Configuration.GetValue<bool>("UseProxyAngular");
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../../mineswe.io";
                
                if (env.IsDevelopment())
                {
                    if (useProxy)
                        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                    else
                        spa.UseAngularCliServer("start");
                }
            });

            //app.UseMvc();
        }
    }
}
