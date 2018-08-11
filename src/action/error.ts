import {Exception, RuntimeException} from "../exception";
import {Action} from "../type";

export const ERROR_ACTION_TYPE: string = "@@framework/error";

export function errorAction(error: any): Action<Exception> {
    const exception: Exception = error instanceof Exception ? error : new RuntimeException(error && error.message ? error.message : "unknown error", error);

    // Avoid output in jest (process.env.NODE_ENV === "test")
    if (process.env.NODE_ENV === "development") {
        console.error(exception);
    }
    return {
        type: ERROR_ACTION_TYPE,
        payload: exception,
    };
}
