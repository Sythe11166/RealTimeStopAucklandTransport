const API_KEY = "d98a9819265043cfb60312c6506862a5"
const STOP_ID = "8274"

async function loadDepartures() {

const url = `https://api.at.govt.nz/v2/public/realtime/departures/stop/${STOP_ID}`

const response = await fetch(url,{
headers:{
'Ocp-Apim-Subscription-Key':API_KEY
}
})

const data = await response.json()

const table = document.getElementById("departures")
table.innerHTML = ""

if(!data.response || data.response.length === 0){
table.innerHTML = "<tr><td colspan='3'>No upcoming buses</td></tr>"
return
}

data.response.slice(0,10).forEach(bus=>{

const route = bus.routeShortName
const destination = bus.tripHeadsign
const time = new Date(bus.expectedDepartureTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})

const row = document.createElement("tr")

row.innerHTML = `
<td class="route">${route}</td>
<td>${destination}</td>
<td class="time">${time}</td>
`

table.appendChild(row)

})

document.getElementById("updated").innerText = new Date().toLocaleTimeString()

}

loadDepartures()

setInterval(loadDepartures,30000)
