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

export const columns = [
    {
      accessorKey: "MaNV",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost"
            className="flex items-center justify-start pl-0" // Loại bỏ padding trái và căn nội dung sang trái
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            
          >
            <span className="pr-0 text-foreground">Mã người dùng</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground" />
          </Button>
        )
      },
    },
    {
      accessorKey: "HoTen",
      header: "Họ Tên",
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
            <span className="pr-0 text-foreground">Ngày sinh</span>
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
            <span className="pr-0 text-foreground">Ngày vào Discord</span>
            <ArrowUpDown className="ml-2 h-4 w-4 text-foreground"/>
          </Button>
        )
      },
      cell: ({ row }) => formattedDate(row.original.NgayVaoLam),
    },
    {
      accessorKey: "Username",
      header: "Tên Đăng Nhập",
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
            <span className="pr-0 text-foreground">Roles</span>
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
          props={{title:"Chỉnh sửa thông tin người dùng", description:"Nhập thông tin người dùng"}}
          formComponent={EditMemberForm}
          Member = {row.original}
        >
        </PopupModal>  
        <PopupModal
          open={workHistoryOpen}
          setOpen={setWorkHistoryOpen}
          props={{title:"Lịch sử truy cập", description:"Chi tiết lịch sử truy cập của người dùng"}}
          formComponent={WorkHistoryDetail}
          MemberID = {row.original.MaNV}
          MemberDepartment = {row.original.MaBP}
        >
        </PopupModal> 

        <AlertDialogComponent 
          open= {reviewOpen} 
          setOpen={setReviewOpen} 
          func={() => {}}
          title={"Điểm của người dùng"} 
          description={`Điểm người dùng này là: ${review}`} 
          >
        </AlertDialogComponent>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chức năng</DropdownMenuLabel>
            <DropdownMenuItem onClick= {() => setWorkHistoryOpen(true)}>
              Xem lịch sử truy cập
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick= {() => setEditOpen(true)}>
              Chỉnh sửa thông tin
            </DropdownMenuItem>
            <DropdownMenuItem onClick= {() => setReviewOpen(true)}>
              Điểm đánh giá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </>
      )
    }},
  ];