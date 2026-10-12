"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function OldDashboard() {
  const [online, setOnline] = useState(false);
  const ONLINE_DELAY = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnline(true);
    }, ONLINE_DELAY * 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-md border-2 border-white/10 bg-gray-900 p-4">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold">GET api/KAR v0.1</h3>
        {online ? (
          <Badge className="bg-green-700">Online</Badge>
        ) : (
          <Badge className="bg-yellow-700">Connecting</Badge>
        )}
      </div>
      <div className="flex" />
    </div>
  );
}
