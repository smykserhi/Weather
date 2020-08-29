const searchBtn = document.getElementById('search');
const mainContent = document.getElementById("main")

mainContent.style.backgroundImage = `url('media/sun.jpg')`;
// document.body.style.backgroundImage = `url("./media/fog.jpg");`
const info = document.getElementById('info');
const weatherID = '25c082c9e69e148d7de97964fcb2def4'
let htmltext = '';
let nextDay = new Date();
nextDay.setDate(nextDay.getDate() - 1 );
// searchBtn.addEventListener('click', getWeather)
//function which fetching API
function fetchData(url) {
    return fetch(url)
             .then(checkStatus)  
             .then(res => res.json())
             .catch(error => console.log('Looks like there was a problem!', error))
  }
  //Function check Api status
  function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  //Creating todays repotr
  function createTodayReport(data){     
    console.log(data)  
    let currentWeather = data.weather[0].main
    //changing beckground image depend on weather
    if(currentWeather === "Clouds" || currentWeather === "Haze" ) {
        mainContent.style.backgroundImage = `url('media/fog.jpg')`;        
    } 
    else if(currentWeather === "Rain") {
        mainContent.style.backgroundImage = `url('media/Rain.jpg')`;         
    }  
    else if(currentWeather === "Snow") {
        mainContent.style.backgroundImage = `url('media/snow.jpg')`;         
    }   
    else {
        mainContent.style.backgroundImage = `url('media/sun.jpg')`;        
    }   
    //create current report
    htmltext = ""      
    htmltext += "<section>"  
        htmltext += `<p><h3><b>City:</b> ${data.name}</h3></p>`;
        htmltext += `<p><h4><b>Country:</b> ${data.sys.country}</h4></p>`
        htmltext += `<p><h4><b>Current weather:</b> ${data.weather[0].main} <b>temp:</b> ${data.main.temp} &#186F</h4></p>`
    htmltext += "</section>"               
    return data;
  }
  //creating table fot 7 days report
  function create7DaysReport(data){    
                console.log(data) 
                console.log(htmltext)                                 
                htmltext += `<table id="table" class="table table-dark table-striped">`
                console.log(htmltext)    
                    htmltext += `<thead>`
                        htmltext += `<tr>`
                            htmltext += `<th scope="col">Date</th>`
                            htmltext += `<<th scope="col">Min</th>`
                            htmltext += `<<th scope="col">Max</th>`
                            htmltext += `<th scope="col">Weather</th>`
                        htmltext += `</tr>`
                    htmltext += `</thead>`
                    htmltext += `<tbody>`
                    data.daily.map(el =>{ 
                        htmltext += `<tr ">`
                            htmltext += `<th scope="row">${nextDayDate()}</th>`
                            htmltext += `<th scope="row">${el.temp.min} &#186F</th>`
                            htmltext += `<th scope="row">${el.temp.max} &#186F</th>`
                            htmltext += `<th scope="row"><img src="http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png" alt="icon"></th>`
                        htmltext += `</tr>`
                    })
                    htmltext += `</tbody>`
                htmltext += `</table>`
                //reset current date
                nextDay = new Date();
                nextDay.setDate(nextDay.getDate() - 1 );
                //insert in page
                info.innerHTML = htmltext;                
                return data;
  }
  //main function 
  function getWeather(){
    const city = document.getElementById('city').value;
    const currentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherID}&units=imperial`;
    let forecastUrl = "";   
        fetchData(currentWeather)
            .then(data =>createTodayReport(data))
            .then(data =>fetchData(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherID}&units=imperial`)
            .then(data => create7DaysReport(data)))  
            .catch((error) => {
                htmltext = `<h3> CITY NOT FOUND</h3>`
                info.innerHTML = htmltext;
                console.error('Error:', error);
              });      
    }
    //function set up next calendar date
    function nextDayDate() {
        // get today's date then add one        
        nextDay.setDate(nextDay.getDate() + 1);  
        let day = nextDay.getDate();       
        if (day < 10) { day = "0" + day }  
        return  day ;
  }
//Function validate input field an call main function if not empty
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          else {
            event.preventDefault();
            getWeather() // call main function if fild is not empty
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();