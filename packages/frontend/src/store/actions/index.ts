export enum SessionsActions {
    START = 'SESSIONS:START',
    STOP = 'SESSIONS:STOP'
}


export const startNewSession = () => ({ type: SessionsActions.START })