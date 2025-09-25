using Comments.API.Mapping;
using Comments.API.Validators;
using Comments.Data.Contexts;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CommentsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<CommentMappingProfile>();
});

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CommentCreateDtoValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<GetPagedCommentsRequestValidator>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CommentsContext>();
    db.Database.Migrate();
}

var useHttps = app.Configuration.GetValue<bool?>("UseHttpsRedirection") ?? app.Environment.IsDevelopment();
if (useHttps)
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();