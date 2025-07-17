const http = require("http");

const url = require("url");

const API_KEY = "38e23dcbdfaf0aa685f660150a876b68"; 

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (req.method === "GET" && path === "/weather") {
    const city = parsedUrl.query.city;

    if (!city) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "You need to enter a city name!" }));
      return;
    }

    try {
      const api_link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(api_link);
      const weather_data = await response.json();

      if (weather_data.cod !== 200) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: weather_data.message }));
        return;
      }

      const display_op = {
        city: weather_data.name,
        temperature: weather_data.main.temp,
        condition: weather_data.weather[0].main, 
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(display_op));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch weather data" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3030, () => {
  console.log("Server running at port 3030, http://localhost:3030");
});
