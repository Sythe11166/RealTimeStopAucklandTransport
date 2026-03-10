const API_KEY = "512717404df5457a8b8e78fce1b24591"
const STOP_ID = "8274"

async function loadBuses(){

const url = `https://api.at.govt.nz/v2/public/realtime/stopdepartures/${STOP_ID}`

try{

const response = await fetch(url,{
headers:{
"Ocp-Apim-Subscription-Key":API_KEY
}
})

const data = await response.json()

const table = document.getElementById("buses")
table.innerHTML=""

const departures = data.response

if(!departures || departures.length === 0){
table.innerHTML="<tr><td colspan='3'>No buses</td></tr>"
return
}

departures.slice(0,6).forEach(bus=>{

const route = bus.routeShortName
const destination = bus.tripHeadsign

const arrivalTime = new Date(bus.expectedDepartureTime)
const now = new Date()

let minutes = Math.round((arrivalTime-now)/60000)

let display = minutes<=0 ? "Due" : minutes+" min"

const row = document.createElement("tr")

row.innerHTML = `
<td class="route">${route}</td>
<td>${destination}</td>
<td class="time">${display}</td>
`

table.appendChild(row)

})

}catch(error){

console.error("API error:",error)

}

}

loadBuses()

setInterval(loadBuses,20000)
