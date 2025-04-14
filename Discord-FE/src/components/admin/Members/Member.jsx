"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "./Layout";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import { columns } from "./Columns";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../layout/LanguageProvider";
import { getUsers, deleteUser } from "../BE-Services/user_services";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export default function Member() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [members, setMembers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const filteredData = data.filter(
          (user) => user.uid !== currentUser?.uid
        );
        setMembers(filteredData);
        setTotalSize(filteredData.length);
      } catch (error) {
        toast.error(`${error.message}`);
      }
    };
    fetchUsers();
  }, []);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleOpenDeleteModal = (uid) => {
    setMemberToDelete(uid);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await deleteUser(memberToDelete);
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.uid !== memberToDelete)
        );
        setTotalSize((prevSize) => prevSize - 1);
        toast.success(t("Member deleted successfully"));
      } catch (error) {
        toast.error(`${error.message}`);
      }
    }
    setIsDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  const pageSize = 10;
  const totalPages = Math.ceil(members.length / pageSize);
  const paginatedMembers = members.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DefaultLayout>
      <h1 className="text-xl sm:text-2xl font-normal p-4">
        {t("Members")} ({totalSize})
      </h1>

      <DataTable
        columns={columns({ onDelete: handleOpenDeleteModal })}
        data={paginatedMembers.map((member, index) => ({
          ...member,
          num: (currentPage - 1) * pageSize + index + 1,
        }))}
        filterProps={{
          column: "username",
          placeholder:
            language === "en"
              ? "Find member by name"
              : "Tìm thành viên bằng tên...",
        }}
      />

      <div className="flex items-center justify-end space-x-2 py-4 px-2 sm:px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          {t("Previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          {t("Next")}
        </Button>
      </div>

      {/* Modal xác nhận xóa */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Blocking")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to block this user?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t("Block")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}
