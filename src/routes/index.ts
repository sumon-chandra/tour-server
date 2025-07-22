import { Router } from "express";
import { UserRoutes } from "../modules/user/users.route";

export const router = Router()

const modulesRouters = [
    {
        path: "/users",
        route: UserRoutes
    }
]

modulesRouters.forEach((route) => {
    router.use(route.path, route.route)
})
