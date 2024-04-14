
function weatherIcon(weatherCode) {}

const ICON_MAP = {};

addMapping([0, 1], "sun");
addMapping([2], "cloud-sun");
addMapping([3], "cloud");
addMapping([45, 48], "smog");
addMapping(
	[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
	"cloud-showers-heavy"
);
addMapping([71, 73, 75, 77, 85, 86], "snowflake");
addMapping([95, 96, 99], "cloud-bolt");

function addMapping(values, icon) {
	values.forEach((value) => {
		ICON_MAP[value] = icon;
	});
}
console.log(ICON_MAP);
console.log(ICON_MAP[45]);

const weatherMap = new Map();

weatherMap.set([0, 1], "sun");
weatherMap.set([2], "cloud-sun");
weatherMap.set([3], "cloud");
weatherMap.set([45, 48], "smog");
weatherMap.set(
	[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
	"cloud-showers-heavy"
);
weatherMap.set([71, 73, 75, 77, 85, 86], "snowflake");
weatherMap.set([95, 96, 99], "cloud-bolt");
