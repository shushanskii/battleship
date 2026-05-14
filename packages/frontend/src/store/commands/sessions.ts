export enum SessionCommands {
  START = "SESSIONS:START",
  STOP = "SESSIONS:STOP",
}

export const startSession = () => ({ type: SessionCommands.START })
