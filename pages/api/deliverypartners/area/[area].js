import mongoose from "mongoose";
import { NextResponse } from "next/server"
import { connectionStr } from "../../../lib/db";
import { deliveryPartnersSchema } from "../../../lib/deliverypartnersModel";

export async function GET(request,content){
    let area=content.params.area
    let success=false;
    await mongoose.connect(connectionStr);
    let filter={area:{$regex:new RegExp(area,'i')}}
    const result = await deliveryPartnersSchema.find(filter)
    return NextResponse.json({result})

}