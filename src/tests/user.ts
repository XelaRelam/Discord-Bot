import getRoleplayArray from "../utils/getRoleplayArray";
import { Database, RoleplayType } from "../database/prisma";

(async() => {
  const user1 = await Database.getOrCreateUser('123');
  const user2 = await Database.getOrCreateUser('321');
  console.log(getRoleplayArray(user1));
  console.log(getRoleplayArray(user2));
})();