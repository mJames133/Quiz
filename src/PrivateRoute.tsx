import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "./stores/auth-context";

interface PrivateRouteProps extends RouteProps {
  component: any;
}

export function PrivateModRoute(props: PrivateRouteProps) {
  const { component: Component, ...rest } = props;
  const { currentUser, roles } = useAuth();

  return (
    <Route
      {...rest}
      render={(routeProps: any) => {
        return (roles[0].isMod || roles[0].isAdmin) && currentUser ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/Quiz/" />
        );
      }}
    ></Route>
  );
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, ...rest } = props;
  const { currentUser, roles } = useAuth();

  return (
    <Route
      {...rest}
      render={(routeProps: any) => {
        return roles[0].isAdmin && currentUser ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/Quiz/" />
        );
      }}
    ></Route>
  );
}
