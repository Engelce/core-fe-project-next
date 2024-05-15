import React from "react";
import {Navigate, Route as ReactRouterDOMRoute, type PathRouteProps, type RouteProps, useLocation, useMatch, useNavigate, useNavigationType} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";
import {app} from "../app";

interface Config {
    accessCondition?: boolean;
    unauthorizedRedirectTo?: string;
    notFound?: boolean;
}
function withHOC(WrappedComponent: React.ComponentType, {path, accessCondition, unauthorizedRedirectTo, notFound}: Required<Config> & {path: string}) {
    return function NewComponent(props: any) {
        const navigate = useNavigate();
        const action = useNavigationType();
        const location = useLocation();
        const match = useMatch(path);
        if (accessCondition) {
            return notFound ? withNotFoundWarning(WrappedComponent) : <WrappedComponent {...props} location={location} match={match} navigate={navigate} action={action} />;
        } else {
            return <Navigate to={unauthorizedRedirectTo} />;
        }
    };
}
export const cloneRoute = (element: JSX.Element, config?: Config) => {
    const {ErrorBoundary: ErrorComp, Component, path} = element.props as RouteProps;
    const props: RouteProps = {
        ...element.props,
        Component: withHOC(Component!, {
            path: path!,
            accessCondition: true,
            unauthorizedRedirectTo: "/",
            notFound: false,
            ...config,
        }),
        ErrorBoundary: ErrorComp
            ? props => (
                  <ErrorBoundary>
                      <ErrorComp {...props} />
                  </ErrorBoundary>
              )
            : ErrorComp,
    };

    return React.cloneElement(element, props);
};

// interface Props extends PathRouteProps {
//     Component: React.ComponentType<any>;
//     // All below are optional
//     withErrorBoundary: boolean;
//     accessCondition: boolean;
//     unauthorizedRedirectTo: string;
//     notFound: boolean;
// }

// export class Route extends React.PureComponent<Props> {
//     static defaultProps = {
//         exact: true,
//         sensitive: true,
//         withErrorBoundary: true,
//         accessCondition: true,
//         unauthorizedRedirectTo: "/",
//         notFound: false,
//     };

//     renderRegularRouteComponent = (props: RouteProps): React.ReactElement => {
//         const {Component, accessCondition, unauthorizedRedirectTo, notFound, withErrorBoundary} = this.props;
//         if (accessCondition) {
//             const WrappedComponent = notFound ? withNotFoundWarning(Component) : Component;
//             const routeNode = <WrappedComponent {...props} />;
//             return withErrorBoundary ? <ErrorBoundary>{routeNode}</ErrorBoundary> : routeNode;
//         } else {
//             return <Navigate to={unauthorizedRedirectTo} />;
//         }
//     };

//     override render() {
//         const {Component, ...restRouteProps} = this.props;
//         // return <ReactRouterDOMRoute {...restRouteProps} Component={this.renderRegularRouteComponent} />;
//         return React.cloneElement(<ReactRouterDOMRoute {...restRouteProps} Component={this.renderRegularRouteComponent} />, {});
//     }
// }

function withNotFoundWarning<T extends {}>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
    return class extends React.PureComponent<T> {
        override componentDidMount() {
            app.logger.warn({
                action: "@@framework/route-404",
                elapsedTime: 0,
                errorMessage: `${location.href} not supported by <Route>`,
                errorCode: "ROUTE_NOT_FOUND",
                info: {},
            });
        }

        override render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
