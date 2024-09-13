import { NextResponse } from "next/server";
import { VERSION, AWS_BRANCH, isProduction, AWS_ENDPOINT } from "@/lib/env";

export const GET = async () => {
    const responseBody = { version: VERSION, branch: AWS_BRANCH, production: isProduction(), endpoint: AWS_ENDPOINT };
    return new NextResponse(JSON.stringify(responseBody), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};