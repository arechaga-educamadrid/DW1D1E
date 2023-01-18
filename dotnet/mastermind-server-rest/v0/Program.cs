using Daw2022.Juegos.Mastermind.RestServer.HostedServices;
using Daw2022.Juegos.Mastermind.RestServer.Services;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------------------------
// Add services to the container

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// añadimos el "almacen" de las jugadas
builder.Services.AddSingleton<IAlmacenJuegosMastermind, AlmacenMemoriaMastermind>();

// añadimos el servicio de "house keeping" para eliminar juegos caducados
builder.Services.AddHostedService<MastermindHousekeepingService>();

var app = builder.Build();

// --------------------------------------------------------------------------
// Configure the HTTP request pipeline

// habilitamos Swagger y SwaggerUI siempre (incluso en "producción")
// if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
} // if

// añadimos soporte para servidor web convencional
app.UseDefaultFiles();
app.UseStaticFiles();

// obviamos la redirección automática de http a https
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
