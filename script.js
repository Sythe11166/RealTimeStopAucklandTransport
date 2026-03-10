const API_KEY = "512717404df5457a8b8e78fce1b24591"
const STOP_ID = "8274"
const STOP_NAME = "Stop 8274"

async function loadBuses(){

  const url = `https://api.at.govt.nz/v2/public/realtime/stopdepartures/${STOP_ID}`
  const table = document.getElementById("buses")
  const stopHeader = document.getElementById("stop")
  
  try{
    
    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY
      },
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    table.innerHTML = ""
    stopHeader.textContent = STOP_NAME

    const departures = data.response

    if(!departures || departures.length === 0){
      table.innerHTML = "<tr><td colspan='3'>No buses scheduled</td></tr>"
      return
    }

    departures.slice(0, 6).forEach(bus => {

      const route = bus.routeShortName || "N/A"
      const destination = bus.tripHeadsign || "Unknown"

      const arrivalTime = new Date(bus.expectedDepartureTime)
      const now = new Date()

      let minutes = Math.round((arrivalTime - now) / 60000)

      let display = minutes <= 0 ? "Due" : minutes + " min"

      const row = document.createElement("tr")

      row.innerHTML = `
        <td class="route">${route}</td>
        <td>${destination}</td>
        <td class="time">${display}</td>
      `

      table.appendChild(row)

    })

  } catch(error){

    console.error("API error:", error)
    table.innerHTML = `<tr><td colspan='3' style='color: #ff6b6b;'>Error: ${error.message}</td></tr>`

  }

}

loadBuses()

setInterval(loadBuses, 20000)