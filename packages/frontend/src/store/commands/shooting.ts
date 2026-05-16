export enum ShootingCommands {
  SHOOT = "SHOOTING:SHOOT",
}

export const shootCommand = (coordinate: string) => ({
  type: ShootingCommands.SHOOT,
  payload: coordinate,
})
