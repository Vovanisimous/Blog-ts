import * as React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";

interface IPrivateRouteProps extends RouteProps {
    auth: boolean;
    render: (props: RouteComponentProps) => React.ReactNode;
}

export const PrivateRoute = (props: IPrivateRouteProps) => {
    const { render, auth, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(routeProps: RouteComponentProps) =>
                auth ? render(routeProps) : <Redirect exact to={"/"} />
            }
        />
    );
};
