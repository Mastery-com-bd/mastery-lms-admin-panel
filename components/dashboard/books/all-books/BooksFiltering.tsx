"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChangeInput } from "../../category/all/CategoryFiltering";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BooksFiltering = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("all");
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (input: ChangeInput) => {
    const name = "target" in input ? input.target.name : input.name;
    const value = "target" in input ? input.target.value : input.value;
    const params = new URLSearchParams(searchParams.toString());
    if (name === "productStatus") {
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
    } else {
      params.set(name, value);
    }
    router.push(`${pathName}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleReset = () => {
    router.push(`${pathName}`);
    setSearchTerm("");
    setStatus("");
  };
  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
      <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
        <div className="relative w-full md:w-75">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="searchTerm"
            placeholder="Search categories..."
            className="pl-9 bg-muted/30 border-none"
            value={searchTerm}
            onChange={(e) => {
              handleChange(e);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <Select
          value={status}
          name="productStatus"
          onValueChange={(value) => {
            setStatus(value);
            handleChange({ name: "productStatus", value });
          }}
        >
          <SelectTrigger className="w-full md:w-37.5 bg-muted/30 border-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {["PUBLISHED", "DRAFT", "ARCHIVED"].map((item, i) => {
              const formatted =
                item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
              return (
                <SelectItem key={i} value={item}>
                  {formatted}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleReset}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BooksFiltering;
