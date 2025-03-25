import React, { useState } from 'react';
import DefaultLayout from './Layout';
import { DataTable } from '../../ui/data-table';
import { Button } from '../../ui/button';
import { columns } from './Columns';
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import { PopupModal } from "../../ui/modal";
import { DatePicker } from '../../ui/date-picker';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../LanguageProvider';
import { t } from 'i18next';
export default function Member() {
  const [AddMemberOpen, setAddMemberOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [members, setMembers] = useState([]); // State to store members
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddMember = (newMember) => {
    console.log("Adding member:", newMember);
    setMembers((prevMembers) => [...prevMembers, newMember]);
    setTotalSize((prevSize) => prevSize + 1);
  };

  const pageSize = 5; // Number of items per page
  const totalPages = Math.ceil(members.length / pageSize); // Derived value
  const paginatedMembers = members.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-7 mt-0 pt-[10px]">
        <h1 className="text-2xl font-normal p-4">{t('Members')} ({totalSize})</h1>
        {
          language == "en" ?
            <PopupModal
              open={AddMemberOpen}
              setOpen={setAddMemberOpen}
              formComponent={AddMemberForm}
              props={{
                title: "Add new member",
                description: "Enter member information",
                onAddMember: handleAddMember,  // Kiểm tra xem giá trị này có đúng không
              }}
            >
              <Button className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-6">
                Add member
              </Button>
            </PopupModal>
            :
            <PopupModal
              open={AddMemberOpen}
              setOpen={setAddMemberOpen}
              formComponent={AddMemberForm}
              props={{
                title: "Thêm thành viên mới",
                description: "Nhập thông tin thành viên",
                onAddMember: handleAddMember,  // Kiểm tra xem giá trị này có đúng không
              }}
            >
              <Button className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-6">
                Thêm thành viên
              </Button>
            </PopupModal>
        }

      </div>
      {
        language == "en" ?
        <DataTable columns={columns} data={paginatedMembers} filterProps={{ column: "HoTen", placeholder: "Find member by name" }} />
        :
        <DataTable columns={columns} data={paginatedMembers} filterProps={{ column: "HoTen", placeholder: "Tìm thành viên bằng tên..." }} />
      }
      

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          {t('Previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {t('Next')}
        </Button>
      </div>
    </DefaultLayout>
  );
}

function AddMemberForm({ className, setOpen, onAddMember }) {
  console.log("Props received in AddMemberForm:", { setOpen, onAddMember });
  const handleClose = () => {
    setOpen(false); // This will close the popup modal
  };
  const [birthDate, setBirthDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('1');
  const [department, setDepartment] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding new member...");

    const newMember = {
      MaNV: Date.now().toString(),
      HoTen: fullName,
      NgaySinh: birthDate,
      NgayVaoLam: startDate,
      MaBP: department,
      Username: fullName.replace(/\s+/g, '').toLowerCase()
    };

    onAddMember(newMember);
    handleClose();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="full_name">{t('Full Name')}</Label>
        <Input type="text" id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dob">{t('Date of birth')}</Label>
        <DatePicker
          date={birthDate} /* Pass state value */
          onDateChange={setBirthDate} /* Pass state handlers */
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="start_date">{t('EchoChat join date')}</Label>
        <DatePicker
          date={startDate} /* Pass state value */
          onDateChange={setStartDate} /* Pass state handlers */
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branch">{t('Server ID')}</Label>
        <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">RoleID</Label>
        <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>
      <Button type="submit">{t('Add')}</Button>
      <Button onClick={handleClose} variant="outline">{t('Cancel')}</Button>
    </form>
  );
}

export function EditMemberForm({ className, setOpen, Member, onEditMember }) {
  const [editedMember, setEditedMember] = useState({ ...Member });

  const handleClose = () => {
    setOpen(false); // Đóng modal
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedMember((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu sau khi chỉnh sửa:", editedMember);
    onEditMember(editedMember); // Gửi dữ liệu lên component cha
    setOpen(false); // Đóng modal sau khi sửa
  };

  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="name">{t('Full Name')}</Label>
        <Input
          type="text"
          id="HoTen"
          value={editedMember.HoTen}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dob">{t('Date of birth')}</Label>
        <DatePicker
          date={editedMember.NgaySinh}
          onDateChange={(date) => setEditedMember((prev) => ({ ...prev, NgaySinh: date }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="start_date">{t('EchoChat join date')}</Label>
        <DatePicker
          date={editedMember.NgayVaoLam}
          onDateChange={(date) => setEditedMember((prev) => ({ ...prev, NgayVaoLam: date }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">RoleID</Label>
        <Input
          id="MaBP"
          value={editedMember.MaBP}
          onChange={handleChange}
        />
      </div>
      <Button className="bg-blue-500 text-white" type="submit">{t('Edit')}</Button>
      <Button onClick={handleClose} variant="outline">{t('Cancel')}</Button>
    </form>
  );
}


export function TerminateMemberForm({ className, setOpen }) {
  const handleClose = () => {
    setOpen(false); // This will close the popup modal
  };
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Date:", endDate);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="end_date">Ngày xóa</Label>
        <DatePicker
          date={endDate} /* Pass state value */
          onDateChange={setEndDate} /* Pass state handlers */
        />
      </div>
      <div className='flex justify-between'>
        <Button onClick={handleClose} variant="outline">Hủy</Button>
        <Button type="submit">Xác nhận</Button>
      </div>
    </form>
  );
}

export function WorkHistoryDetail({ className, MemberID, MemberDepartment }) {
  const rowsPerPage = 5;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const data = [];  // Temporary empty data

  return (
    <>
      <Table className="rounded-lg border border-gray-100">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Server</TableHead>
            <TableHead >{t('Start date')}</TableHead>
            <TableHead >{t('End date')}</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {data.slice(startIndex, endIndex).map((item) => {
            return (
              <React.Fragment key={`${item.MaCN}-${item.NgayBatDau}-${item.NgayKetThuc}`}>
                <TableRow >
                  <TableCell >{item.MaCN}</TableCell>
                  <TableCell>{item.NgayBatDau}</TableCell>
                  <TableCell>{item.NgayKetThuc}</TableCell>
                  <TableCell>{MemberDepartment}</TableCell>
                </TableRow>
              </React.Fragment>
            )
          })}

        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                startIndex === 0 ? "pointer-events-none opacity-50 " : "cursor-pointer hover:bg-gray-200 active:bg-gray-300"
              }
              onClick={() => {
                setStartIndex(startIndex - rowsPerPage);
                setEndIndex(endIndex - rowsPerPage);
              }} />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={
                endIndex === data.length ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-200 active:bg-gray-300"
              }
              onClick={() => {
                setStartIndex(startIndex + rowsPerPage); //10
                setEndIndex(endIndex + rowsPerPage); //10 + 10 = 20
              }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}