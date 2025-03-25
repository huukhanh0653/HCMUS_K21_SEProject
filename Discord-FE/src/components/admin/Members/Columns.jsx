"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { EditMemberForm, WorkHistoryDetail, TerminateMemberForm } from "./Member";
import { Button } from "../../ui/button"
import { PopupModal } from "../../ui/modal"
import React from "react";
import { AlertDialogComponent } from "./Alert-Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

import { formattedDate } from "../../../lib/utils";
import { useTranslation } from "react-i18next";


export const columns = () => {
  const {t} = useTranslation();
  return [
    {
      accessorKey: "MaNV",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost"
            className="flex items-center justify-start pl-0" // Loại bỏ padding trái và căn nội dung sang trái
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            
          >
            <span className="pr-0 text-foreground">{t('User ID')}</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
          </Button>
        )
      },
    },
    {
      accessorKey: "HoTen",
      header: t('Full Name'),
    },
    {
      accessorKey: "NgaySinh",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost"
            className="flex items-center justify-start pl-0" // Loại bỏ padding trái và căn nội dung sang trái
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-0 text-foreground">{t("Date of birth")}</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground"/>
          </Button>
        )
      },
      cell: ({ row }) => formattedDate(row.original.NgaySinh),
    },
    {
      accessorKey: "NgayVaoDiscord",
      enableResizing: false,
      size: 200,
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost"
            className="flex items-center justify-start pl-0" // Loại bỏ padding trái và căn nội dung sang trái
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-0 text-foreground">{t('EchoChat join date')}</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground"/>
          </Button>
        )
      },
      cell: ({ row }) => formattedDate(row.original.NgayVaoLam),
    },
    {
      accessorKey: "Username",
      header: t('Username'),
    },
    {
      accessorKey: "MaBP",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost"
            className="flex items-center justify-start pl-0" // Loại bỏ padding trái và căn nội dung sang trái
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-0 text-foreground">{t('Roles')}</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground"/>
          </Button>
        )
      },
    },
    {
    id: "actions",
    cell: ({ row }) => {
      const [editOpen, setEditOpen] = React.useState(false)
      const [terminateOpen, setTerminateOpen] = React.useState(false)
      const [workHistoryOpen, setWorkHistoryOpen] = React.useState(false)
      const [reviewOpen, setReviewOpen] = React.useState(false)
      const [review, setReview] = React.useState(0);

      return (
        <>
        <PopupModal
          open={editOpen}
          setOpen={setEditOpen}
          props={{title:t("Edit user info"), description:t("Enter user info")}}
          formComponent={EditMemberForm}
          Member = {row.original}
        >
        </PopupModal>  
        <PopupModal
          open={workHistoryOpen}
          setOpen={setWorkHistoryOpen}
          props={{title:t("Browsing history"), description:t("Details about user browsing history")}}
          formComponent={WorkHistoryDetail}
          MemberID = {row.original.MaNV}
          MemberDepartment = {row.original.MaBP}
        >
        </PopupModal> 

        <AlertDialogComponent 
          open= {reviewOpen} 
          setOpen={setReviewOpen} 
          func={() => {}}
          title={t('User score')} 
          description={`${t("User's score is:")} ${review}`} 
          >
        </AlertDialogComponent>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('Open menu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Feature")}</DropdownMenuLabel>
            <DropdownMenuItem onClick= {() => setWorkHistoryOpen(true)}>
              {t("View browsing history")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick= {() => setEditOpen(true)}>
              {t("Edit infor")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick= {() => setReviewOpen(true)}>
              {t("Rating score")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </>
      )
    }},
  ];
}