"use client";

import React, { useState, useEffect, useMemo } from "react";
import DefaultLayout from "./Layout";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import { columns } from "./Columns";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../layout/LanguageProvider";
import UserService from "../../../services/UserService";
import toast from "react-hot-toast";
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
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [memberToBan, setMemberToBan] = useState(null);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [memberToUnban, setMemberToUnban] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await UserService.getUsers();
        const filteredData = userId
          ? data.filter((user) => user.id !== userId)
          : data;
        setMembers(filteredData);
        setTotalSize(filteredData.length);
      } catch (error) {
        toast.error(`${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [userId]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleOpenBanModal = (uid) => {
    setMemberToBan(uid);
    setIsBanModalOpen(true);
  };

  const handleConfirmBan = async () => {
    if (memberToBan) {
      setIsLoading(true);
      try {
        const user = await UserService.getUserByID(memberToBan);
        await UserService.updateUser(memberToBan, {
          ...user,
          status: "banned",
        });

        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberToBan ? { ...member, status: "banned" } : member
          )
        );
        toast.success(t("Member banned successfully"));
      } catch (error) {
        toast.error(`${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    setIsBanModalOpen(false);
    setMemberToBan(null);
  };

  const handleCancelBan = () => {
    setIsBanModalOpen(false);
    setMemberToBan(null);
  };

  const handleOpenUnbanModal = (uid) => {
    setMemberToUnban(uid);
    setIsUnbanModalOpen(true);
  };

  const handleConfirmUnban = async () => {
    if (memberToUnban) {
      setIsLoading(true);
      try {
        const user = await UserService.getUserByID(memberToUnban);
        await UserService.updateUser(memberToUnban, {
          ...user,
          status: "offline",
        });

        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberToUnban
              ? { ...member, status: "offline" }
              : member
          )
        );
        toast.success(t("Member unbanned successfully"));
      } catch (error) {
        toast.error(`${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    setIsUnbanModalOpen(false);
    setMemberToUnban(null);
  };

  const handleCancelUnban = () => {
    setIsUnbanModalOpen(false);
    setMemberToUnban(null);
  };

  const processedMembers = useMemo(() => {
    let filteredMembers = [...members];

    if (filterValue) {
      filteredMembers = filteredMembers.filter((member) =>
        member.username?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      filteredMembers.sort((a, b) => {
        const aValue = a[id] || "";
        const bValue = b[id] || "";
        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
      });
    }

    return filteredMembers.map((member, index) => ({
      ...member,
      num: index + 1,
    }));
  }, [members, filterValue, sorting]);

  useEffect(() => {
    setTotalSize(processedMembers.length);
    setCurrentPage(1);
  }, [processedMembers]);

  const pageSize = 10;
  const totalPages = Math.ceil(processedMembers.length / pageSize);
  const paginatedMembers = processedMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DefaultLayout>
      <h1 className="text-xl sm:text-2xl font-normal p-4">
        {t("Members")} ({totalSize})
      </h1>

      <DataTable
        columns={columns({
          onBan: handleOpenBanModal,
          onUnban: handleOpenUnbanModal,
        })}
        data={paginatedMembers}
        filterProps={{
          column: "username",
          placeholder:
            language === "en"
              ? "Find member by name"
              : "Tìm thành viên bằng tên...",
          value: filterValue,
          onChange: setFilterValue,
        }}
        buildInSearch={false}
        onSortingChange={setSorting}
        isLoading={isLoading}
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

      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("Confirm")} {t("ban")}
            </DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to")} {t("ban")} {t("this person?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelBan}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmBan}>
              {t("Ban")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUnbanModalOpen} onOpenChange={setIsUnbanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("Confirm")} {t("unban")}
            </DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to")} {t("unban")} {t("this person?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUnban}>
              {t("Cancel")}
            </Button>
            <Button
              variant="default"
              className="bg-green-500"
              onClick={handleConfirmUnban}
            >
              {t("Unban")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}
