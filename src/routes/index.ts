import { Router } from "express";
import { UserRoutes } from "../modules/user/users.route";
import { AuthRouter } from "../modules/auth/auth.route";

export const router = Router()

const modulesRouters = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRouter
    }
]

modulesRouters.forEach((route) => {
    router.use(route.path, route.route)
})
