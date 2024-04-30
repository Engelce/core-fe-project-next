import React, {useEffect, useRef} from "react";
import {unstable_usePrompt} from "react-router-dom";
import type {State} from "../sliceStores";

interface OwnProps {
    message: string;
    isPrevented: boolean;
}

interface Props extends OwnProps {}

// class Component extends React.PureComponent<Props, State> {
//     override componentDidUpdate(prevProps: Readonly<Props>): void {
//         const {message, isPrevented} = this.props;
//         if (prevProps.isPrevented !== isPrevented) {
//             window.onbeforeunload = isPrevented ? () => message : null;
//         }
//     }

//     override render() {
//         const {isPrevented, message} = this.props;
//         return <Prompt message={message} when={isPrevented} />;
//     }
// }

// export const NavigationGuard = Component;

function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export const NavigationGuard = (props: Props) => {
    const {message, isPrevented} = props;
    const prev = usePrevious<Props>(props);

    useEffect(() => {
        if (prev?.isPrevented !== isPrevented) {
            window.onbeforeunload = isPrevented ? () => message : null;
        }
    }, [prev, isPrevented]);

    unstable_usePrompt({
        message,
        when: isPrevented,
    });

    return null;
};
