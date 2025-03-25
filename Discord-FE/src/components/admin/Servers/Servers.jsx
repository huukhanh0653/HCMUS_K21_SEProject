import React, { useState } from 'react';
import DefaultLayout from '../Members/Layout';
import { DataTable } from '../../ui/data-table';
import { Button } from '../../ui/button';
import { columns } from './Columns';
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import { PopupModal } from "../../ui/modal";
import { DatePicker } from '../../ui/date-picker';
import { useLanguage } from '../../layout/LanguageProvider';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export default function ServerManagement() {
  const [AddServerOpen, setAddServerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [servers, setServers] = useState([]);
  const { language, toggleLanguage } = useLanguage();
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

  const pageSize = 5;
  const totalPages = Math.ceil(servers.length / pageSize);
  const paginatedServers = servers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-7 mt-0 pt-[10px]">
        <h1 className="text-2xl font-normal p-4">Servers ({totalSize})</h1>
        {
          language == "en" ?
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
            :
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
        }
      </div>
      {
        language == "en" ?
        <DataTable columns={columns()} data={paginatedServers} filterProps={{ column: "ServerName", placeholder: "Find Server by name..." }} />
        :
        <DataTable columns={columns()} data={paginatedServers} filterProps={{ column: "ServerName", placeholder: "Tìm Server bằng tên..." }} />
      }
      

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
          {t('Previous')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
          {t('Next')}
        </Button>
      </div>
    </DefaultLayout>
  );
}

function AddServerForm({ className, setOpen, onAddServer }) {
  const handleClose = () => {
    setOpen(false);
  };
  const [serverName, setServerName] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [creationDate, setCreationDate] = useState(null);
  const [adminID, setAdminID] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding new server...");

    const newServer = {
      ServerID: Date.now().toString(),
      ServerName: serverName,
      ServerIP: serverIP,
      CreatedDate: creationDate || new Date(), // Đảm bảo không bị null
      AdminID: adminID,
    };

    onAddServer(newServer);
    handleClose();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="server_name">{t('Server name')}</Label>
        <Input type="text" id="server_name" value={serverName} onChange={(e) => setServerName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="server_ip">IP Server</Label>
        <Input type="text" id="server_ip" value={serverIP} onChange={(e) => setServerIP(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="creation_date">{t('Creation date')}</Label>
        <DatePicker date={creationDate} onDateChange={setCreationDate} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="admin_id">Admin ID</Label>
        <Input type="text" id="admin_id" value={adminID} onChange={(e) => setAdminID(e.target.value)} required />
      </div>
      <Button type="submit">{t("Add")}</Button>
      <Button onClick={handleClose} variant="outline">{t('Cancel')}</Button>
    </form>
  );
}
