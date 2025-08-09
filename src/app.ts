import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./routes"
import { globalErrorHandler } from "./middlewares/global-error-handler"
import notFound from "./middlewares/not-found"
import cookieParser from "cookie-parser"


const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Tour Management System")
})

app.use(globalErrorHandler)
app.use(notFound)

export default app