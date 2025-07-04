using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1) configura CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy
          .WithOrigins("http://localhost:4200")   // URL do seu front
          .AllowAnyHeader()
          .AllowAnyOrigin()
          .AllowAnyMethod();
    });
});

// 2) serviços normais da API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ArcadeScore API", Version = "v1" });
});

var app = builder.Build();

// 3) use CORS **antes** de UseAuthorization / MapControllers
app.UseCors("AllowAngularClient");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ArcadeScore API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
// --- a/vscode-scm:git/scm0/input?rootUri%3Dfile%253A%252F%252F%252Fc%25253A%252FUsers%252Famiranda%252FDownloads%252FProjeto%252520de%252