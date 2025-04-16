"use client";

import { ArrowUpDown, Ban } from "lucide-react";
import { Button } from "../../ui/button";
import React from "react";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../../assets/discord-logo.png";
import toast from "react-hot-toast";

export const columns = ({ onBan }) => {
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
        <span className="text-xs sm:text-sm pl-1">{row.original.num}</span> // Sử dụng num từ dữ liệu
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-start px-1 text-xs sm:text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Username")}</span>
          <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.username}
        >
          {row.original.username}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="items-center justify-start px-1 text-xs sm:text-sm hidden sm:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Email")}</span>
          <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.email}
        >
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "avatar",
      header: () => (
        <span className="text-xs sm:text-sm hidden md:block">
          {t("Avatar")}
        </span>
      ),
      cell: ({ row }) => (
        <img
          src={row.original.avatar || defaultAvatar}
          alt="Avatar"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden md:block border border-gray-200"
        />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="items-center justify-start px-1 text-xs sm:text-sm hidden sm:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t("Status")}</span>
          <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="text-xs sm:text-sm truncate pl-1 max-w-[120px] sm:max-w-[200px] block"
          title={row.original.status}
        >
          {t(`${row.original.status}`)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          member.status !== "banned" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                try {
                  onBan(member.id);
                } catch (error) {
                  toast.error(t("Failed to ban member"));
                }
              }}
              className="p-1 sm:p-2"
              title={t("Ban member")}
            >
              <Ban className="h-3 sm:h-4 w-3 sm:w-4" />
            </Button>
          )
        );
      },
    },
  ];
};
