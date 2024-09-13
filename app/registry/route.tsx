import { NextResponse } from "next/server";
import { addItem, deleteItem, queryItemsByServiceUrl } from "@/lib/db";

export const POST = async (request: Request) => {
    const body = await request.json();
    const modelsRepoUrl = body.modelsRepoUrl;
    const response = await fetch(modelsRepoUrl + '/models');
    const models = await response.json();
    const modelsListNew = [];
    for (const model of models) {
        await addItem(model);
        modelsListNew.push(model.id);
    }
    const modelsx = await queryItemsByServiceUrl(modelsRepoUrl);
    let deletedCounter = 0;
    if (modelsx) {
        for (const modelx of modelsx) {
            if (!modelsListNew.includes(modelx.id)) {
            await deleteItem(modelx.id, modelsRepoUrl);
                deletedCounter++;
            }
        }
    }
    const responseBody = { modelsUpdated: models.length, modelsDeleted: deletedCounter, status: 'success' };
    return new NextResponse(JSON.stringify(responseBody), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};