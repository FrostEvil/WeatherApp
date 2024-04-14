const dailyTempAll = document.querySelectorAll(".days-box--temperature");
const dailyWeatherIconAll = document.querySelectorAll(".days-box--icon");
const dailyWeeksDayAll = document.querySelectorAll(".days-box--name");
const details = document.querySelector(".details");

const searchBtn = document.querySelector(".location--search");

searchBtn.addEventListener("click", () => {
	const city = document.querySelector(".location--name").value;
	positionSuccess(city);
});

async function getApiCoords(city) {
	const COORDS_API = `https://api.geoapify.com/v1/geocode/search?city=${city}&limit=1&apiKey=9851780d57e04b13aaa9f68e28b2b6f4`;

	return await fetch(COORDS_API)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response wasn't ok");
			}
			return response.json();
		})
		.then((result) => {
			return result.features[0].geometry;
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation", error);
		});
}

async function getApiWeather([coords]) {
	const [long, lat] = coords;
	const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max`;

	return await fetch(WEATHER_API)
		.then((response) => {
			return response.json();
		})
		.then((result) => {
			return {
				current: parseCurrentWeather(result),
				hourly: parseHourlyWeather(result),
				daily: parseDailyWeather(result),
			};
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation", error);
		});
}

// function parseCoords({ coords }) {
// 	console.log(coords);
// 	const { coordinates } = coords;
// 	// console.log(coordinates);
// }

function parseCurrentWeather({ current, daily }) {
	const { temperature_2m, weather_code } = current;
	const {
		temperature_2m_max,
		temperature_2m_min,
		apparent_temperature_max,
		apparent_temperature_min,
		wind_speed_10m_max,
		precipitation_sum,
	} = daily;

	return {
		currentTemp: temperature_2m,
		maxTemp: temperature_2m_max[0],
		minTemp: temperature_2m_min[0],
		maxFlTemp: apparent_temperature_max[0],
		minFlTemp: apparent_temperature_min[0],
		windSpeed: wind_speed_10m_max[0],
		precipitation: precipitation_sum[0],
		weatherCode: weather_code,
	};
}

function parseHourlyWeather({ hourly }) {
	const {
		apparent_temperature,
		relative_humidity_2m,
		wind_speed_10m,
		precipitation_probability,
		weather_code,
		time,
	} = hourly;
	return {
		hourlyTemp: apparent_temperature,
		hourlyHumidity: relative_humidity_2m,
		hourlyWind: wind_speed_10m,
		hourlyPrecip: precipitation_probability,
		hourlyWeatherCode: weather_code,
		hourlyTime: time,
	};
}

function parseDailyWeather({ daily }) {
	const { temperature_2m_max, weather_code, time } = daily;

	return {
		dailyTemp: temperature_2m_max,
		dailyWeatherCode: weather_code,
		dailyTime: time,
	};
}

function positionSuccess(city) {
	getApiCoords(city).then((result) => {
		getApiWeather([result.coordinates])
			.then(renderWeather)
			.catch((error) => {
				console.error("Cannot get weater data", error);
			});
	});
	// getApiWeather()
	// 	.then(renderWeather)
	// 	.catch((error) => {
	// 		console.error("Cannot get weather data", error);
	// 	});
}

const weatherIconMap = new Map();

function weaterIcon(values, icon) {
	values.forEach((value) => {
		weatherIconMap.set(value, icon);
	});
}

weaterIcon([0, 1], "sun");
weaterIcon([2], "cloud-sun");
weaterIcon([3], "cloud");
weaterIcon([45, 48], "smog");
weaterIcon(
	[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
	"cloud-showers-heavy"
);
weaterIcon([71, 73, 75, 77, 85, 86], "snowflake");
weaterIcon([95, 96, 99], "cloud-bolt");

function renderWeather({ current, daily, hourly }) {
	renderCurrentWeather(current);
	renderDailyWeather(daily);
	renderHourlyWeather(hourly);
}

function setValue(selector, value) {
	document.querySelector(`[data-${selector}]`).textContent = value;
}

function renderCurrentWeather(current) {
	setValue("current-temp", current.currentTemp);
	setValue("current-high", current.maxTemp);
	setValue("current-fl-high", current.maxFlTemp);
	setValue("current-wind", current.windSpeed);
	setValue("current-low", current.minTemp);
	setValue("current-fl-low", current.minFlTemp);
	setValue("current-precip", current.precipitation);

	document
		.querySelector(".header--left")
		.firstElementChild.setAttribute("src", getWeatherIcon(current.weatherCode));
}

function renderDailyWeather(daily) {
	for (let i = 0; i < daily.dailyTemp.length; i++) {
		dailyTempAll[i].innerText = `${daily.dailyTemp[i]} \u00B0C `;

		dailyWeatherIconAll[i].firstElementChild.setAttribute(
			"src",
			getWeatherIcon(daily.dailyWeatherCode[i])
		);

		dailyWeeksDayAll[i].textContent = getWeekDay(daily.dailyTime[i]).weekDay;
	}
}

function renderHourlyWeather(hourly) {
	for (let i = 0; i < hourly.hourlyTemp.length; i++) {
		details.innerHTML += `
		<div class="details__group ${i % 2 === 0 ? "details--even" : "details--odd"}">
		<div class="details--hour ">
			<div class="label">${getWeekDay(hourly.hourlyTime[i]).weekDay}</div>
			<div>${getWeekDay(hourly.hourlyTime[i]).hour}</div>
		</div>
		<div class="details--icon">
			<img src=${getWeatherIcon(hourly.hourlyWeatherCode[i])} alt="" />
		</div>
		<div class="details--temp">
			<div class="label">Temp</div>
			<div>${hourly.hourlyTemp[i]}&deg;</div>
		</div>
		<div class="details--humidity">
			<div class="label">Humi</div>
			<div>${hourly.hourlyHumidity[i]}%</div>
		</div>
		<div class="details--wind">
			<div class="label">Wind</div>
			<div>${hourly.hourlyWind[i]} km/h</div>
		</div>
		<div class="details--precip">
			<div class="label">Precip</div>
			<div>${hourly.hourlyPrecip[i]} mm</div>
		</div>
	</div>
		`;
	}
}

function getWeekDay(baseDate) {
	const baseDateRedable = new Date(baseDate);
	const weekDay = baseDateRedable.toLocaleDateString("en-EN", {
		weekday: "long",
	});
	const hour = baseDateRedable.toLocaleString("en-EN", {
		hour: "numeric",
		hour12: true,
	});

	return { weekDay, hour };
}

function getWeatherIcon(weatherCode) {
	return `/icons/${weatherIconMap.get(weatherCode)}.svg`;
}
