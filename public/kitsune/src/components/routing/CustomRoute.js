import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * Create a component with props
 * @param component React Component
 * @param rest Props
 * @returns Component with props
 */
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
      React.createElement(component, finalProps)
  );
};

/**
 * Overwrite Route Component with props for admin
 * @param component React Component
 * @param rest Props
 * @returns if isAdmin Return Page Component or Redirect to Signin
 */
export const PrivateRoute = ({component, ...rest}) => {
    return (
        <Route {...rest} render={routeProps => {
            if (rest.isAdmin) {
                return renderMergedProps(component, routeProps, rest);
            } else {
                return <Redirect to="/signin"/>
            }
        }}/>
    );
};

function supK (number){

    number > 1000 ? number.toString().slice(0, -2) + "K" : number;
        return
    } else {
        return
    }

}