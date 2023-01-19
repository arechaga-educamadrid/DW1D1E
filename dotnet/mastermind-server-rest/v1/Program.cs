using Daw2022.Juegos.Mastermind.RestServer.HostedServices;
using Daw2022.Juegos.Mastermind.RestServer.Services;
using Microsoft.AspNetCore.Mvc.Formatters;

const bool habilitarXML = true;
const bool inhabilitarTextoPlano = true;
const bool habilitarCors = true;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------------------------
// Add services to the container

var iBuilder = builder.Services.AddControllers(options => 
{
    if (inhabilitarTextoPlano)
    {
        options.OutputFormatters.RemoveType<StringOutputFormatter>();
    } // if
});

// Crear política CORS
builder.Services.AddCors(options =>
{
   options.AddPolicy("PermitirTodo", politica =>
   {
        politica.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
   }) ;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// añadimos el "almacen" de las jugadas
builder.Services.AddSingleton<IAlmacenJuegosMastermind, AlmacenMemoriaMastermind>();

// añadimos el servicio de "house keeping" para eliminar juegos caducados
builder.Services.AddHostedService<MastermindHousekeepingService>();

// añadimos soporte para serialización XML
if (habilitarXML)
{
    iBuilder.AddXmlSerializerFormatters();
} // if

var app = builder.Build();

// --------------------------------------------------------------------------
// Configure the HTTP request pipeline

if (habilitarXML)
{
    app.Logger.Log(LogLevel.Information, "Habilitado soporte de formato XML");
} // if
if (inhabilitarTextoPlano)
{
    app.Logger.Log(LogLevel.Information, "Inhabilitado soporte de formato de texto plano");
} // if

// habilitamos Swagger y SwaggerUI siempre (incluso en "producción")
// if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
} // if

// habilitamos soporte CORS
if (habilitarCors)
{
    app.Logger.Log(LogLevel.Information, "Habilitando soporte CORS");
    app.UseCors();
} // if

// añadimos soporte para servidor web convencional
app.UseDefaultFiles();
app.UseStaticFiles();

// obviamos la redirección automática de http a https
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
