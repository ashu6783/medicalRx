"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function Navigation() {
    return (
        <div>
            <h1>Navigation</h1>
            <Map />
        </div>
    );
}
