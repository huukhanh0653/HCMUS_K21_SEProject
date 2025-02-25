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

export default function Member() {
  const [AddMemberOpen, setAddMemberOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [totalSize, setTotalSize] = useState(0);
  const [members, setMembers] = useState([]); // State để lưu trữ dữ liệu thành viên

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddMember = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
    setTotalSize((prevSize) => prevSize + 1);
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-7 mt-0 pt-[10px]">
        <h1 className="text-2xl font-normal p-4">Thành viên ({totalSize})</h1>
        
        <PopupModal 
          open={AddMemberOpen} 
          setOpen={setAddMemberOpen} 
          formComponent={AddMemberForm} 
          props={{title: "Thêm thành viên mới", description: "Nhập thông tin thành viên", onAddMember: handleAddMember}}
        >
          <Button className="px-6 py-0 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-6">
            Thêm nhân viên
          </Button>
        </PopupModal>
      </div>
      <DataTable columns={columns} data={members} filterProps={{column: "HoTen", placeholder: "Tìm thành viên bằng tên..."}}/>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </DefaultLayout>
  );
}

function AddMemberForm({ className, setOpen, onAddMember }) {
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
        <Label htmlFor="full_name">Họ tên</Label>
        <Input type="text" id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dob">Ngày sinh</Label>
        <DatePicker
          date={birthDate} /* Pass state value */
          onDateChange={setBirthDate} /* Pass state handlers */
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="start_date">Ngày vào Discord</Label>
        <DatePicker 
          date={startDate} /* Pass state value */
          onDateChange={setStartDate} /* Pass state handlers */
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="branch">Mã Server</Label>
        <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">RoleID</Label>
        <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>
      <Button type="submit">Thêm</Button>
      <Button onClick={handleClose} variant="outline">Hủy</Button>
    </form>
  );
}

export function EditMemberForm({ className, setOpen, Member }) {
  const handleClose = () => {
    setOpen(false); // This will close the popup modal
  };
  const [birthDate, setBirthDate] = useState(Member.NgaySinh);
  const [startDate, setStartDate] = useState(Member.NgayVaoLam);
  const [terminateDate, setTerminateDate] = useState(Member.NgayNghiViec);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Date:", birthDate);
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Họ tên</Label>
        <Input type="text" id="name" defaultValue={Member.HoTen}/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dob">Ngày sinh</Label>
        <DatePicker
          date={birthDate} /* Pass state value */
          onDateChange={setBirthDate} /* Pass state handlers */
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="start_date">Ngày vào Discord</Label>
        <DatePicker 
          date={startDate} /* Pass state value */
          onDateChange={setStartDate} /* Pass state handlers */
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">RoleID</Label>
        <Input id="department" defaultValue={Member.MaBP} />
      </div>
      <Button className="bg-blue-500 text-white" type="submit">Sửa</Button>
      <Button onClick={handleClose} variant="outline">Hủy</Button>
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
      <Table className= "rounded-lg border border-gray-100">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Server</TableHead>
            <TableHead >Ngày bắt đầu</TableHead>
            <TableHead >Ngày kết thúc</TableHead>
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