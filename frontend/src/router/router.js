import React, { useMemo } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getRoutes } from "./routes";

const RenderRoute = ({ comp, params }) => {
    const Component = comp; 
    return <Component params={params}/>; 
};

export const Routing = () => {
    // BrowserRouter = https://reactrouter.com/en/main/router-components/browser-router
    // Routes = https://reactrouter.com/en/main/components/routes
    // Route = https://reactrouter.com/en/main/route/route
    const routes = useMemo(() => getRoutes(), []);
    console.log(routes)
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => (
                    <Route
                        key={route.url}
                        path={route.url}
                        element={
                            <RenderRoute
                                comp={route.comp}
                                params={route.params}
                            />
                        }
                    />
                ))}
            </Routes>
        </BrowserRouter>
    )
}