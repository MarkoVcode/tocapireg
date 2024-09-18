import { NextResponse } from "next/server";
import { queryItemByIndex } from "@/lib/db";

export const GET = async (request: Request, context: { params: { modelId: string } }) => {
    const modelId = context.params.modelId;
    const data = await queryItemByIndex(
        'modelId',
        'id = :modelId',
        { ':modelId': modelId });
    if (!data) {
        return new NextResponse(JSON.stringify({ error: "Model not found!" }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

