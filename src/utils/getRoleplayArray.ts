import { RoleplayType, UserData } from "../database/prisma";

export type RoleplayArray = {
  name: string,
  given: number,
  received: number
}[]

export default function(user: UserData) {
  const obj = new Array<RoleplayArray[number]>()

  for (const type of Object.values(RoleplayType)) {
    if (typeof type !== "number") continue

    obj.push({
      name: RoleplayType[type],
      given: user.roleplayGiven.filter(x => x.type === type).length,
      received: user.roleplayReceived.filter(x => x.type === type).length
    })
  }

  return obj
}