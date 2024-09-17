import { NextResponse } from "next/server";
import { scanTable } from "@/lib/db";

export const GET = async (request: Request, context: { params: { modelId: string } }) => {

    const data = await scanTable();
    if (!data) {
        return new NextResponse(JSON.stringify({ error: "No data found" }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const modelId = context.params.modelId;
    const selectedItem = data.find(item => item.id === modelId);
    if (!selectedItem) {
        return new NextResponse(JSON.stringify({ error: "Model not found" }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new NextResponse(JSON.stringify(selectedItem), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });


    // this is not working while deployed due to the following error:
    // ⨯ i [CredentialsProviderError]: Could not load credentials from any providers
    //
    // const modelId = context.params.modelId;
    // const data = await queryItemByIndex(
    //     'modelId',
    //     'id = :modelId',
    //     { ':modelId': modelId });
    // return new NextResponse(JSON.stringify(data), { 
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' }
    // });
};

