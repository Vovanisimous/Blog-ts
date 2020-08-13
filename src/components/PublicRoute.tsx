import React, { FC } from "react";
import { Route, Redirect, RouteProps, RouteComponentProps } from "react-router";

interface IPublicRouteProps extends RouteProps {
    auth: boolean;
    render: (props: RouteComponentProps) => React.ReactNode;
}

export const PublicRoute: FC<IPublicRouteProps> = (props) => {
    const { auth, render, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(routeProps: RouteComponentProps) =>
                auth ? <Redirect exact={true} push={true} to={"/"} /> : render(routeProps)
            }
        />
    );
};
