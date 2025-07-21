import dotEnv from "dotenv"
dotEnv.config()

interface EnvTypes {
    NODE_ENV: "development" | "production",
    DB_URL: string,
    PORT: string
}

const loadEnv = (): EnvTypes => {
    const envVarsArray = ["NODE_ENV", "DB_URL", "PORT"]

    envVarsArray.forEach((env) => {
        if (!process.env[env]) {
            throw new Error(`${env} environment variable not found!`)
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string
    }
}

export const envVars = loadEnv()