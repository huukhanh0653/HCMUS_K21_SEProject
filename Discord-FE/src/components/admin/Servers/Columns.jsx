import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import React from "react";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../../assets/discord-logo.png";

export const columns = (
  setEditServerOpen,
  setCurrentServer,
  handleOpenDeleteModal
) => {
  const { t } = useTranslation();

  const baseColumns = [
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
          <span className="pr-0 text-foreground">{t("Server Name")}</span>
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
          title={row.original.owner_username}
        >
          {row.original.owner_username}
        </span>
      ),
    },
    {
      accessorKey: "server_pic",
      header: () => (
        <span className="text-xs sm:text-sm hidden md:block">
          {t("Server picture")}
        </span>
      ),
      cell: ({ row }) => (
        <img
          src={row.original.server_pic || defaultAvatar}
          alt="Picture"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:block border border-gray-200"
        />
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
    {
      accessorKey: "actions",
      header: () => <span className="text-xs sm:text-sm">{t("Actions")}</span>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentServer(row.original);
              setEditServerOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDeleteModal(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return baseColumns;
};
