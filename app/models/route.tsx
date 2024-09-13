import { NextResponse } from "next/server";
import { scanTable } from "@/lib/db";

export const GET = async () => {
    const data = await scanTable();
    return new NextResponse(JSON.stringify(data), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};