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

const BookCategoryFilter = () => {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (input: ChangeInput) => {
    const name = "target" in input ? input.target.name : input.name;
    const value = "target" in input ? input.target.value : input.value;
    const params = new URLSearchParams(searchParams.toString());
    if (name === "isActive") {
      if (value === "active") params.set(name, "true");
      else if (value === "inactive") params.set(name, "false");
      else params.delete(name);
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
    setIsActive("");
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
          value={isActive}
          name="isActive"
          onValueChange={(value) => {
            setIsActive(value);
            handleChange({ name: "isActive", value });
          }}
        >
          <SelectTrigger className="w-full md:w-37.5 bg-muted/30 border-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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

export default BookCategoryFilter;
