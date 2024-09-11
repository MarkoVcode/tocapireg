import { NextResponse } from "next/server";

const data = {
    name: "MODELS",
    email: "john.doe@example.com",
    age: 30,
    gender: "male",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    city: "Anytown",
    state: "CA",
}

export const GET = async () => {
    return new NextResponse(JSON.stringify(data), { status: 200 });
};