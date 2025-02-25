import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../../ui/alert-dialog"
  import { Button } from "../../ui/button"
import { set } from "date-fns";
  
  export function AlertDialogComponent({ setOpen, open, func, title, description, ...props }) {
    function handleCancel() {
      setOpen(false);
      setValue(false);
    }
    function handleContinue() {
      setOpen(false);
      func();
    }
    return (
      <AlertDialog open= {open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick = {handleCancel}>Hủy</AlertDialogCancel>
            <AlertDialogAction className="hover:bg-red-400" onClick= {handleContinue}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  