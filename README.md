# [how's the weather?](https://seanstephenbrian.github.io/weather-app/)

**how's the weather?** is a weather app powered by data from a third-party API, with a gentle, unique 
design featuring paintings by j.m.w. turner.

async functions retrieve the weather data for the user-specified location from the API, then pass that 
information along to DOM rendering methods which display that information on the page.

the header painting varies based on whether it is day or night in the specified location, and the background color updates based on the current weather conditions as reported by the API.

the user can toggle between fahrenheit and celsius.