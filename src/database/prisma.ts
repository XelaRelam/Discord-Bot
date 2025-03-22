import { PrismaClient } from "@prisma/client";

const userIncludes = {
  roleplayGiven: true,
  roleplayReceived: true,
};

export enum RoleplayType {
    Bonk,
    Wave,
    Tickle
}

export type UserData = Exclude<Awaited<ReturnType<typeof Database["getUser"]>>, null>
export type RoleplayCommandData = UserData["roleplayGiven"][number]

export const Database = new (class Database extends PrismaClient {
  public async getUser(id: string) {
    return this.user.findUnique({
      where: {
        id,
      },
      include: userIncludes,
    });
  }

  public async createUser(id: string) {
    return this.user.create({
      data: {
        id,
      },
      include: userIncludes,
    });
  }

  public async getOrCreateUser(id: string) {
    const user = await this.getUser(id);
    if (!user) return this.createUser(id);
    return user;
  }

  public async addRoleplayCommand(type: RoleplayType, userId: string, targetId: string) {
    return this.roleplayCommand.create({
        data: {
            userId,
            targetId,
            type
        }
    })
  }
})();
