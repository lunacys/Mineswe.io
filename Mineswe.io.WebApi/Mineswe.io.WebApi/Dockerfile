#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Mineswe.io.WebApi.csproj", "Mineswe.io.WebApi.csproj"]
RUN dotnet restore "Mineswe.io.WebApi.csproj"
COPY . .

RUN dotnet build "Mineswe.io.WebApi.csproj" -c Release -o /app/build
RUN chmod +x ./entrypoint.sh
CMD /bin/bash ./entrypoint.sh

FROM build AS publish
RUN dotnet publish "Mineswe.io.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT Development
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Mineswe.io.WebApi.dll"]