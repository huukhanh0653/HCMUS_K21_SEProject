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
  import { useTranslation } from "react-i18next";
  export function AlertDialogComponent({ setOpen, open, func, title, description, ...props }) {
    const {t} = useTranslation();
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
            <AlertDialogCancel onClick = {handleCancel}>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction className="hover:bg-red-400" onClick= {handleContinue}>{t("Confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  