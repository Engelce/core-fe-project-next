import {LOCATION_CHANGE} from "connected-react-router";
import {setStateAction} from "./reducer";
import {Store} from "redux";
import {SagaIterator} from "redux-saga";
import {put} from "redux-saga/effects";
import {initialState, State} from "../state";
import {ERROR_ACTION_TYPE, errorAction} from "./error";

let state = initialState;

export class Handler<S extends object, R extends State = State> {
    readonly module: string;
    private readonly initialState: S;

    public constructor(module: string, initialState: S) {
        this.module = module;
        this.initialState = initialState;
    }

    protected get state(): Readonly<S> {
        return state.app[this.module];
    }

    protected get rootState(): Readonly<R> {
        return state as Readonly<R>;
    }

    protected *resetState(): SagaIterator {
        yield put(setStateAction(this.module, this.initialState));
    }

    protected *setState(newState: Partial<S>): SagaIterator {
        yield put(setStateAction(this.module, newState));
    }
}

export const storeListener = (store: Store<State>) => () => {
    state = store.getState();
};

export function* run(handler: ActionHandler, payload: any[]): SagaIterator {
    try {
        yield* handler(...payload);
    } catch (error) {
        yield put(errorAction(error));
    }
}

export type ActionHandler = (...args: any[]) => SagaIterator;

export class Handlers {
    readonly effects: {[actionType: string]: ActionHandler} = {};
    readonly listeners: {[actionType: string]: ActionHandler[]} = {
        [LOCATION_CHANGE]: [],
        [ERROR_ACTION_TYPE]: [],
    };
}
