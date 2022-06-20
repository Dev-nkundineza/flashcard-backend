import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";   
import { Request } from "express"; 

const prisma= new PrismaClient();

export interface Context {
    prisma: PrismaClient;
}

export interface Context {
    prisma: PrismaClient;
    userId?: number;  // 1
}

export const context = ({ req }: { req: Request }): Context => {   // 2
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {  
        prisma,
        userId: token?.userId, 
    };
};