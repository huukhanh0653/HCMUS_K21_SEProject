"use client";

import React, { useState, useEffect, useMemo } from "react";
import DefaultLayout from "../Members/Layout";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import { columns } from "./Columns";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import { PopupModal } from "../../ui/modal";
import { useLanguage } from "../../layout/LanguageProvider";
import { useTranslation } from "react-i18next";

export default function ServerManagement() {
  const [AddServerOpen, setAddServerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [servers, setServers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [sorting, setSorting] = useState([]);
  const { language } = useLanguage();
  const { t } = useTranslation();

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddServer = (newServer) => {
    console.log("Adding server:", newServer);
    setServers((prevServers) => [...prevServers, newServer]);
    setTotalSize((prevSize) => prevSize + 1);
  };

  const processedServers = useMemo(() => {
    let filteredServers = [...servers];

    if (filterValue) {
      filteredServers = filteredServers.filter((server) =>
        server.ServerName?.toLowerCase().includes(filterValue.toLowerCase())
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
      <div className="flex justify-between items-center mb-7 mt-0 pt-[10px]">
        <h1 className="text-2xl font-normal p-4">
          {t("Servers")} ({totalSize})
        </h1>
        {language == "en" ? (
          <PopupModal
            open={AddServerOpen}
            setOpen={setAddServerOpen}
            formComponent={AddServerForm}
            props={{
              title: "Add new Server",
              description: "Enter Server information",
              onAddServer: handleAddServer,
            }}
          >
            <Button className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-6">
              Add Server
            </Button>
          </PopupModal>
        ) : (
          <PopupModal
            open={AddServerOpen}
            setOpen={setAddServerOpen}
            formComponent={AddServerForm}
            props={{
              title: "Thêm Server mới",
              description: "Nhập thông tin Server",
              onAddServer: handleAddServer,
            }}
          >
            <Button className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-6">
              Thêm Server
            </Button>
          </PopupModal>
        )}
      </div>
      {language == "en" ? (
        <DataTable
          columns={columns()}
          data={paginatedServers}
          filterProps={{
            column: "ServerName",
            placeholder: "Find Server by name...",
            value: filterValue,
            onChange: setFilterValue,
          }}
          buildInSearch={false}
          onSortingChange={setSorting}
        />
      ) : (
        <DataTable
          columns={columns()}
          data={paginatedServers}
          filterProps={{
            column: "ServerName",
            placeholder: "Tìm Server bằng tên...",
            value: filterValue,
            onChange: setFilterValue,
          }}
          buildInSearch={false}
          onSortingChange={setSorting}
        />
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          {t("Previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {t("Next")}
        </Button>
      </div>
    </DefaultLayout>
  );
}

function AddServerForm({ className, setOpen, onAddServer }) {
  const handleClose = () => {
    setOpen(false);
  };
  const [serverName, setServerName] = useState("");
  const [serverPic, setServerPic] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      // const data = await getUserByID();
      // const newServer = {
      //   username: data.username,
      //   name: serverName,
      //   serverPic: serverPic || undefined,
      // };
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="server_name">{t("Server name")}</Label>
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
      <Button type="submit">{t("Add")}</Button>
      <Button onClick={handleClose} variant="outline">
        {t("Cancel")}
      </Button>
    </form>
  );
}
