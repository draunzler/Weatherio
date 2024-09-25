from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")
OPENWEATHER_BASE_URL = os.getenv("OPENWEATHER_BASE_URL")
OPENCAGE_BASE_URL = os.getenv("OPENCAGE_BASE_URL")

class WeatherRequest(BaseModel):
    city: str = None
    lat: float = None
    lon: float = None
    units: str

@app.post("/weather")
async def get_weather(request: WeatherRequest):
    async with httpx.AsyncClient() as client:
        if request.city:
            weather_url = f"{OPENWEATHER_BASE_URL}/forecast?q={request.city}&appid={OPENWEATHER_API_KEY}&units={request.units}"
            current_weather_url = f"{OPENWEATHER_BASE_URL}/weather?q={request.city}&appid={OPENWEATHER_API_KEY}&units={request.units}"
        elif request.lat and request.lon:
            weather_url = f"{OPENWEATHER_BASE_URL}/forecast?lat={request.lat}&lon={request.lon}&appid={OPENWEATHER_API_KEY}&units={request.units}"
            current_weather_url = f"{OPENWEATHER_BASE_URL}/weather?lat={request.lat}&lon={request.lon}&appid={OPENWEATHER_API_KEY}&units={request.units}"
        else:
            raise HTTPException(status_code=400, detail="Either city or lat/lon must be provided")

        weather_response = await client.get(weather_url)
        current_weather_response = await client.get(current_weather_url)

        if weather_response.status_code != 200 or current_weather_response.status_code != 200:
            raise HTTPException(status_code=weather_response.status_code, detail="Failed to fetch weather data")

        return {
            "forecast": weather_response.json(),
            "current": current_weather_response.json()
        }

@app.get("/geocode")
async def get_location(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        url = f"{OPENCAGE_BASE_URL}?q={lat}+{lon}&key={OPENCAGE_API_KEY}"
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch location data")

        data = response.json()
        components = data['results'][0]['components']
        city = components.get('town') or components.get('city') or components.get('county')

        if not city:
            raise HTTPException(status_code=404, detail="Location not found")

        return {"city": city}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
