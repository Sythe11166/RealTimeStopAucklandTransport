const express = require("express");
const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("@google/transit-realtime");
const app = express();
const PORT = 3000;

const API_KEY = "109baa24d25a4ad2a9f94f8a52166bd5";
const STOP_ID = "8274"; // numeric stop ID

app.get("/api/buses", async (req, res) => {
    try {
        const response = await fetch(
            "https://api.at.govt.nz/realtime/gtfs/v1/trip-updates",
            { headers: { "Ocp-Apim-Subscription-Key": API_KEY } }
        );

        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.FeedMessage.decode(
            new Uint8Array(buffer)
        );

        const now = Math.floor(Date.now() / 1000);

        // Filter updates for our stop
        const arrivals = [];

        feed.entity.forEach(entity => {
            if (!entity.trip_update) return;

            entity.trip_update.stop_time_update.forEach(stop => {
                if (stop.stop_id !== STOP_ID) return;

                const arrivalTime = stop.arrival?.time || stop.departure?.time;
                const minutes = arrivalTime ? Math.round((arrivalTime - now) / 60) : null;

                arrivals.push({
                    route: entity.trip_update.trip.route_id,
                    destination: entity.trip_update.trip.trip_headsign || "-",
                    arrival: minutes !== null ? `${minutes} min` : "-",
                    scheduledTime: arrivalTime
                        ? new Date(arrivalTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "-",
                    occupancy: stop.occupancy_status || "-"
                });
            });
        });

        res.json({ arrivals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static("public")); // serve frontend from /public

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
