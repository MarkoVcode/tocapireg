import { NextResponse } from "next/server";
import { queryItemByIndex } from "@/lib/db";

export const GET = async (request: Request, context: { params: any }) => {
    const modelId = context.params.modelId;
    const data = await queryItemByIndex(
        'modelId',
        'id = :modelId',
        { ':modelId': modelId });
    return new NextResponse(JSON.stringify(data), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

