import mongoose from "mongoose"
import { Server } from "node:http"
import app from "./app"

let server: Server

const connectServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://idevsumon:idevsumon@clustertour.y0fyyxe.mongodb.net/TourBackendDB")
        console.log("MongoDB connected successfully!")
        server = app.listen(5000, () => {
            console.log("Server is listing on port http://localhost:5000")
        })
    } catch (error) {
        console.log(error)
    }
}

connectServer()

process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection founded!! Server shut down.")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException", () => {
    console.log("Uncaught Exception founded!! Server shut down.")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log("SIGTERM founded")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})