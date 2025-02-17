import { PrismaClient } from "@prisma/client";

class BaseRepository {
    dbClient: PrismaClient;

    constructor(dbClient: PrismaClient){
        this.dbClient = dbClient;
    }
}

export default BaseRepository;