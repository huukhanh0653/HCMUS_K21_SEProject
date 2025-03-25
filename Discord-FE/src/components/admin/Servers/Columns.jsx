"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "../../ui/button";
import { PopupModal } from "../../ui/modal";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { formattedDate } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

export const columns = () => {
  const {t} = useTranslation();
  return [
    {
      accessorKey: "ServerID",
      header: ({ column }) => (
        <Button 
          variant="ghost"
          className="flex items-center justify-start pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t('Server ID')}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
        </Button>
      ),
    },
    {
      accessorKey: "ServerName",
      header: t("Server name"),
    },
    {
      accessorKey: "CreatedDate",
      header: ({ column }) => (
        <Button 
          variant="ghost"
          className="flex items-center justify-start pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="pr-0 text-foreground">{t('Creation date')}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
        </Button>
      ),
      cell: ({ row }) => formattedDate(row.original.CreatedDate),
    },
    {
      accessorKey: "Owner",
      header: t("Owner"),
    },
    {
      accessorKey: "Status",
      header: t("Status"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [editOpen, setEditOpen] = useState(false);
        const [historyOpen, setHistoryOpen] = useState(false);
  
        return (
          <>
            {/*<PopupModal
              open={editOpen}
              setOpen={setEditOpen}
              props={{ title: "Chỉnh sửa thông tin Server", description: "Nhập thông tin Server" }}
              formComponent={EditServerForm}
              Server={row.original}
            />*/}
            
            {/*<PopupModal
              open={historyOpen}
              setOpen={setHistoryOpen}
              props={{ title: "Lịch sử hoạt động", description: "Chi tiết lịch sử hoạt động của Server" }}
              formComponent={ServerHistoryDetail}
              ServerID={row.original.ServerID}
            /> */}
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t('Open menu')}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Feature')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setHistoryOpen(true)}>
                  {t('View activity history')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  {t('Edit infor')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
} 
