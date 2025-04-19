"use client";

import React, { useState, useEffect, useMemo } from "react";
import DefaultLayout from "../Members/Layout";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import { columns } from "./Columns";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import { useLanguage } from "../../layout/LanguageProvider";
import { useTranslation } from "react-i18next";
import ServerChannelService from "../../../services/ServerChannelService";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";

export default function ServerManagement() {
  const [addServerOpen, setAddServerOpen] = useState(false);
  const [editServerOpen, setEditServerOpen] = useState(false);
  const [deleteServerOpen, setDeleteServerOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [serverToDelete, setServerToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [servers, setServers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchAllServers = async () => {
    if (!userId) {
      toast.error(t("User ID not found"));
      return;
    }

    setIsLoading(true);
    try {
      const { servers } = await ServerChannelService.getAllServers(
        userId,
        filterValue
      );
      setServers(servers);
      setTotalSize(servers.length);
    } catch (error) {
      console.error("Error fetching all servers:", error);
      toast.error(`${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServers();
  }, [filterValue, userId]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddServer = async (newServer) => {
    try {
      await ServerChannelService.createServer(userId, {
        name: newServer.serverName.trim(),
        serverPic: newServer.serverPic,
      });
      toast.success(t("Server created successfully"));
      setAddServerOpen(false);
      await fetchAllServers();
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleEditServer = async (updatedServer) => {
    try {
      await ServerChannelService.updateServer(updatedServer.id, userId, {
        name: updatedServer.serverName.trim(),
        serverPic: updatedServer.serverPic,
      });
      toast.success(t("Server updated successfully"));
      setEditServerOpen(false);
      setCurrentServer(null);
      await fetchAllServers();
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleOpenDeleteModal = (server) => {
    setServerToDelete(server);
    setDeleteServerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (serverToDelete) {
      try {
        const response = await ServerChannelService.deleteServer(
          serverToDelete.id,
          userId
        );
        toast.success(t("Server deleted successfully"));
        setCurrentPage(1);
        setFilterValue("");
        await fetchAllServers();
      } catch (error) {
        toast.error(`${error.message}`);
      }
    }
    setDeleteServerOpen(false);
    setServerToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteServerOpen(false);
    setServerToDelete(null);
  };

  const processedServers = useMemo(() => {
    let filteredServers = [...servers];

    if (filterValue) {
      filteredServers = filteredServers.filter((server) =>
        server.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      filteredServers.sort((a, b) => {
        const aValue = a[id] || "";
        const bValue = b[id] || "";
        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
      });
    }

    return filteredServers.map((server, index) => ({
      ...server,
      num: index + 1,
    }));
  }, [servers, filterValue, sorting]);

  useEffect(() => {
    setTotalSize(processedServers.length);
    setCurrentPage(1);
  }, [processedServers]);

  const pageSize = 10;
  const totalPages = Math.ceil(processedServers.length / pageSize);
  const paginatedServers = processedServers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-7 mt-0 pt-[10px] px-4">
        <h1 className="text-2xl font-normal">
          {t("Servers")} ({totalSize})
        </h1>

        <Button
          className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
          onClick={() => setAddServerOpen(true)}
        >
          {t("Add")} Server
        </Button>
      </div>

      <DataTable
        columns={columns(
          setEditServerOpen,
          setCurrentServer,
          handleOpenDeleteModal
        )}
        data={paginatedServers}
        filterProps={{
          column: "name",
          placeholder:
            language === "en"
              ? "Find Server by name..."
              : "Tìm Server bằng tên...",
          value: filterValue,
          onChange: (value) => setFilterValue(value),
        }}
        buildInSearch={false}
        onSortingChange={(newSorting) => setSorting(newSorting)}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
        >
          {t("Previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
        >
          {t("Next")}
        </Button>
      </div>

      <Dialog open={addServerOpen} onOpenChange={setAddServerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Add new Server" : "Thêm Server mới"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Enter Server information"
                : "Nhập thông tin Server"}
            </DialogDescription>
          </DialogHeader>
          <AddServerForm
            setOpen={setAddServerOpen}
            onAddServer={handleAddServer}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editServerOpen} onOpenChange={setEditServerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Edit Server" : "Chỉnh sửa Server"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Update Server information"
                : "Cập nhật thông tin Server"}
            </DialogDescription>
          </DialogHeader>
          {currentServer && (
            <EditServerForm
              setOpen={setEditServerOpen}
              onEditServer={handleEditServer}
              server={currentServer}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteServerOpen} onOpenChange={setDeleteServerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("Confirm")} {t("delete")}
            </DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to")} {t("delete")} server?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
}

function AddServerForm({ className, setOpen, onAddServer }) {
  const [serverName, setServerName] = useState("");
  const [serverPic, setServerPic] = useState("");
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    setServerName("");
    setServerPic("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serverName) {
      toast.error(t("Server name is required"));
      return;
    }

    await onAddServer({ serverName, serverPic });
    setServerName("");
    setServerPic("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="server_name">{t("Server Name")}</Label>
        <Input
          type="text"
          id="server_name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="server_pic">{t("Server picture")}</Label>
        <Input
          type="text"
          id="server_pic"
          value={serverPic}
          onChange={(e) => setServerPic(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">{t("Add")}</Button>
        <Button variant="outline" onClick={handleClose}>
          {t("Cancel")}
        </Button>
      </div>
    </form>
  );
}

function EditServerForm({ className, setOpen, onEditServer, server }) {
  const [serverName, setServerName] = useState(server.name || "");
  const [serverPic, setServerPic] = useState(server.server_pic || "");
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    setServerName("");
    setServerPic("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serverName) {
      toast.error(t("Server name is required"));
      return;
    }

    await onEditServer({ id: server.id, serverName, serverPic });
    setServerName("");
    setServerPic("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="server_name">{t("Server Name")}</Label>
        <Input
          type="text"
          id="server_name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="server_pic">{t("Server picture")}</Label>
        <Input
          type="text"
          id="server_pic"
          value={serverPic}
          onChange={(e) => setServerPic(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">{t("Save")}</Button>
        <Button variant="outline" onClick={handleClose}>
          {t("Cancel")}
        </Button>
      </div>
    </form>
  );
}
