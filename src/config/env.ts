import dotEnv from "dotenv"
dotEnv.config()

interface EnvTypes {
    NODE_ENV: "development" | "production",
    DB_URL: string,
    PORT: string,
    BCRYPT_SALT_ROUND: string,
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const loadEnv = (): EnvTypes => {
    const envVarsArray = ["NODE_ENV", "DB_URL", "PORT", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_EXPIRES", "JWT_REFRESH_SECRET"]

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
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
    }
}

export const envVars = loadEnv()