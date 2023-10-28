const fetchCity = (request) => {
return[
    {
        name: "Lorem",
        id: 1
    },
    {
        name: "Ipsum",
        id: 2
    }
    
]
}
const fillCityList = (list) => {
 const listContainer = document.getElementsByClassName('city-list')[0]
 listContainer.innerHTML = ""
 for(let city of list){
    let newCityItem = document.createElement("div");
    newCityItem.classList = "city-item"
    newCityItem.innerText = city.name
    
    newCityItem.addEventListener('click', () => {
      window.localStorage("city", city)
    })
    listContainer.appendChild(newCityItem)
 }
}

const askUserAboutCity = () => {
    const searchButton = document.getElementById('city-search-button')
    const foundCity = document.getElementById("cityRequestName")
    searchButton.addEventListener('click', function() {
       
        fillCityList(fetchCity(foundCity.value))
        
    })
}

const getCity = async () => {
let city = window.localStorage.getItem("city");
if(city === null){
    askUserAboutCity();
}
}
(async ()=>{
    getCity();
})()