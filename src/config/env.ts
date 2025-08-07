import dotEnv from "dotenv"
dotEnv.config()

interface EnvTypes {
    NODE_ENV: "development" | "production",
    DB_URL: string,
    PORT: string,
    JWT_ACCESS_SECRET: string,
    BCRYPT_SALT_ROUND: string,
    JWT_ACCESS_EXPIRED_IN: string
}

const loadEnv = (): EnvTypes => {
    const envVarsArray = ["NODE_ENV", "DB_URL", "PORT", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRED_IN", "BCRYPT_SALT_ROUND"]

    envVarsArray.forEach((env) => {
        if (!process.env[env]) {
            throw new Error(`${env} environment variable not found!`)
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        DB_URL: process.env.DB_URL as string,
        PORT: process.env.PORT as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRED_IN: process.env.JWT_ACCESS_EXPIRED_IN as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string
    }
}

export const envVars = loadEnv()