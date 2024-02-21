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
import { useState, useEffect } from "react"
import { selectedVersionStore } from "./selectedversion"

export default function VersionSelect({ versions }: { versions: PostgrestSingleResponse<any[]> }) {

    if (!versions.data) {
        return <p>error getting versions info</p>
    }

    const version = selectedVersionStore(state => state)

    // console.log(selectedVersionStore, "selected version store")

    if (!versions.data) {
        return <p>error getting versions info</p>
    }
    const [selectedVersion, setSelectedVersion] = useState(0)

    const selectionItems = versions.data?.map((version: Version, index: number) => (
        <SelectItem key={index} value={`${index}`}>{version.name}</SelectItem>
    ))

    const transformState = (e: number) => {
        // console.log(e, "e")
        const versionData = versions.data[e]
        version.setSelectedVersion(versionData)
        // console.log(versionData, "version data", version)
        setSelectedVersion(e)
    }

    useEffect(() => {
      version.setSelectedVersion(versions.data[versions.data.length - 1])
    
      return () => {
        
      }
    }, [])
    

    return (
        <div className="flex flex-col gap-3">
            <div>
                <p>Version:</p>
                {versions.data && <Select onValueChange={(e) => transformState(parseInt(e))} defaultValue={`${0}`}>
                    <SelectTrigger className="w-[180px] mb-3">
                        <SelectValue placeholder='Please Select'/>
                    </SelectTrigger>
                    <SelectContent>
                        {selectionItems}
                    </SelectContent>
                </Select>}
            </div>
            <a 
                href={`${versions.data[selectedVersion].version_magnet}`}
                className=" bg-blue-600 border border-white rounded-md p-2 hover:bg-blue-500 duration-300 w-24 text-center cursor-pointer"
            >
                <p>Magnet</p>
            </a>
            <p>{versions.data[selectedVersion].version_desc}</p>
        </div>
    )
}