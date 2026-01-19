"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AnalyticsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [month, setMonth] = useState(searchParams.get("month") || "");
  const [day, setDay] = useState(searchParams.get("day") || "");
  const [referer, setReferer] = useState(searchParams.get("referer") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (month) params.set("month", month);
    if (day) params.set("day", day);
    if (referer) params.set("referer", referer);
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
      setYear("");
      setMonth("");
      setDay("");
      setReferer("");
      router.push("?");
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-card">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Year</label>
        <input 
          type="number" 
          className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="YYYY"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Month</label>
        <input 
          type="number" 
          className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="MM"
          min="1" max="12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Day</label>
        <input 
          type="number" 
          className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="DD"
          min="1" max="31"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Referer Domain</label>
        <input 
          type="text" 
          className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="google.com"
          value={referer}
          onChange={(e) => setReferer(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleFilter}>Filter</Button>
        <Button variant="outline" onClick={clearFilters}>Clear</Button>
      </div>
    </div>
  );
}
