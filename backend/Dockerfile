FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Comments.Core/Comments.Core.csproj ./Comments.Core/
COPY Comments.Data/Comments.Data.csproj ./Comments.Data/
COPY Comments.API/Comments.API.csproj ./Comments.API/

RUN dotnet restore ./Comments.API/Comments.API.csproj

COPY Comments.Core ./Comments.Core
COPY Comments.Data ./Comments.Data
COPY Comments.API ./Comments.API

WORKDIR /src/Comments.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Comments.API.dll"]