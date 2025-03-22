import { Database } from "../database/prisma";
import { argv } from "process";

Database.$connect().then(() => import(`./${argv.slice(2).join(" ")}.js`));