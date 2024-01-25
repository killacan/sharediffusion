'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../_components/ui/select"
import { PostgrestSingleResponse } from '@supabase/postgrest-js'
import { Version } from "../models/[title]/page"
import { useState } from "react"

export default function VersionSelect({ versions }: { versions: PostgrestSingleResponse<any[]> }) {

    if (!versions.data) {
        return <p>error getting versions info</p>
    }
    const [selectedVersion, setSelectedVersion] = useState(0)

    const selectionItems = versions.data?.map((version: Version, index: number) => (
        <SelectItem key={index} value={`${index}`}>{version.name}</SelectItem>
    ))

    return (
        <div className="flex flex-col gap-3">
            {versions.data && <Select onValueChange={(e) => setSelectedVersion(parseInt(e))} defaultValue={`${0}`}>
                <SelectTrigger className="w-[180px] my-3">
                    <SelectValue placeholder='Please Select'/>
                </SelectTrigger>
                <SelectContent>
                    {selectionItems}
                </SelectContent>
            </Select>}
            <p>{versions.data[selectedVersion].version_desc}</p>
        </div>
    )
}