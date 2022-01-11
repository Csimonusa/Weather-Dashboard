var inputEl = document.querySelector("input[name=city")
var submitBtn = document.querySelector("#searchbtn")
var previousSearches = document.querySelector("#previous-searches")
var mainEl = document.querySelector("#main-card")
var forecastCards = document.querySelector("#forecast-cards")
var formEl = document.querySelector("form")
searchHistory = []

function getWeather(city) {
    var weatherApiKey = "85d100921461787c5c0b5fb82ee37def"
    var location = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + weatherApiKey

    mainEl.innerHTML = ""
    forecastCards.innerHTML = ""    
    
    fetch(location).then(function(response) {
        return response.json()
        }).then(function(data) {
            var cityData = data[0]
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityData.lat + "&lon=" + cityData.lon + "&exclude=minutely,hourly&units=imperial&appid=" + weatherApiKey
    
            fetch(weatherUrl).then(function(response) {
                return response.json()
            }).then(function(weatherData){    
                var cityName = document.createElement("h2")
                cityName.textContent = city.toUpperCase() + " " + moment.unix(weatherData.current.sunrise).format("MM/DD/YYYY")

                var mainIcon = document.createElement("img")
                mainIcon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png")
                
                cityName.append(mainIcon)
                mainEl.append(cityName)
    
                var searchHistoryList = document.createElement("ul")
    
                var temp = document.createElement("li")
                temp.textContent = "Temp: " + weatherData.current.temp + " F"
                searchHistoryList.append(temp)
    
                var wind = document.createElement("li")
                wind.textContent = "Wind speed: " + weatherData.current.wind_speed + " mph"
                searchHistoryList.append(wind)
    
                var humidity = document.createElement("li")
                humidity.textContent = "Humidty: " + weatherData.current.humidity + "%"
                searchHistoryList.append(humidity)
    
                var uvi = document.createElement("li")
                uvi.textContent = "UV index: " + weatherData.current.uvi
                searchHistoryList.append(uvi)
    
                mainEl.append(searchHistoryList)
    
                var forecastHeader = document.createElement("h2")
                forecastHeader.textContent = "5-day forecast"
                forecastCards.append(forecastHeader)
    
                for (var i = 0; i < 5; i++) {
                    var dayWeather = weatherData.daily[i]
                    var dayWeatherCard = document.createElement("ul")
                    var date = moment.unix(dayWeather.sunrise).format("MM/DD/YYYY")
                
                    dayWeatherCard.append(date)
                    var weatherIcon = document.createElement("img")
                    weatherIcon.setAttribute("src", "https://openweathermap.org/img/w/" + dayWeather.weather[0].icon + ".png")
                    dayWeatherCard.append(weatherIcon)
                    
                    var temp = document.createElement("li")
                    temp.textContent = "Temp: " + dayWeather.temp.day + " F"
                    dayWeatherCard.append(temp)
        
                    var wind = document.createElement("li")
                    wind.textContent = "Wind speed: " + dayWeather.wind_speed + " mph"
                    dayWeatherCard.append(wind)
        
                    var humidity = document.createElement("li")
                    humidity.textContent = "Humidty: " + dayWeather.humidity + "%"
                    dayWeatherCard.append(humidity)
        
                    forecastCards.append(dayWeatherCard)
                  }
                })
            })
        }

    formEl.addEventListener("click", function (e) {
        e.preventDefault()
        var searchValue = inputEl.value.trim()
    
        if(!searchValue) {
            return
        }
    
        searchHistory.push(searchValue)
        getWeather(searchValue)
        generateBtns()
    })
    
    function load() {
        var previousCitiesButtons = localStorage.getItem("previousCities")
        if (previousCitiesButtons) {
            searchHistory = JSON.parse(previousCitiesButtons)
            generateBtns()
        }
    }
    
    function generateBtns() {
        for (var i = 0; i < searchHistory.length; i++) {
            var city = searchHistory[i]
            var newBtn = document.createElement("button")
    
            newBtn.textContent = city
            newBtn.setAttribute("data-value", city)
            newBtn.setAttribute("class", "btn btn-outline-secondary btn-sm")
    
            newBtn.addEventListener("click", function () {
                var SearchCity = this.getAttribute("data-value")
                getWeather(SearchCity)
            })
            previousSearches.append(newBtn)
        }
    
        localStorage.setItem("previousCities", JSON.stringify(searchHistory))
    }
    
    load()