import React from "react";

export const List = (props) => {
    return(
        <ul>
            {props.data.map(d => <li key={d.key}>{d.data}</li>)}
        </ul>
    );
}
