import React from "react";
import {useNavigate} from "react-router-dom";
import {useModuleState} from "../../useModuleState";
import {useLoadingStatus} from "../../../src";
import {actions} from ".";
import {Page as OperationPage} from "../Operation";

export default function Example() {
    const navigate = useNavigate();
    const loading = useLoadingStatus("abc");
    const {list, time} = useModuleState("Template");

    const onItemClick = (item: string) => {
        navigate(`/Template/${item}`);
    };

    const onRefetch = () => {
        actions.getTodoList();
        navigate(`/Template`);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <div>onTick: {time}</div>
            <OperationPage />
            {loading ? <button onClick={actions.cancelGetTodoList}>cancel loading</button> : <button onClick={onRefetch}>refetch</button>}
            <div>{loading ? "loading" : null}</div>
            {list.map(item => (
                <div key={item} onClick={() => onItemClick(item)} style={{cursor: "pointer"}}>
                    {item}
                </div>
            ))}
        </div>
    );
}
