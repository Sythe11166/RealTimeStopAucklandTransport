const API_KEY = "512717404df5457a8b8e78fce1b24591"
const STOP_ID = "8274"

async function loadDepartures(){

try{

const response = await fetch(
`https://api.at.govt.nz/v2/public/realtime/stopdepartures/${STOP_ID}`,
{
headers:{
"Ocp-Apim-Subscription-Key":API_KEY
}
})

const data = await response.json()

console.log(data)

}catch(err){

console.error("API ERROR:",err)

}

}

loadDepartures()
