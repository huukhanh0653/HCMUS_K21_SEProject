import { ArrowUpDown } from "lucide-react";
import { Button } from "../../ui/button";
import React from "react";
import { useTranslation } from "react-i18next";

export const columns = () => {
  const { t } = useTranslation();

  return [
    {
      accessorKey: "num",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-start px-1 text-xs sm:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Num")}</span>
          <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs sm:text-sm pl-1">{row.original.num}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-start px-1 text-xs sm:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Server name")}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.name}
        >
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "owner_username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-start px-1 text-xs sm:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Owner")}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.owner_id}
        >
          {row.original.owner_id}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-start px-1 text-xs sm:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Creation date")}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.created_at}
        >
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      ),
    },
  ];
};
