import * as React from "react";

import { useMediaQuery } from "../../hooks/use-media-query";
import { Button } from "./button";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useTranslation } from "react-i18next";

export function PopupModal({
  children,
  formComponent: FormComponent,
  props,
  open,
  setOpen,
  className,
  ...rest
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className={cn("sm:max-w-[425px]", className)}>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          {FormComponent && (
            <FormComponent setOpen={setOpen} {...props} {...rest} />
          )}
          {/* ✅ Đã truyền đủ props vào FormComponent */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        {FormComponent && (
          <FormComponent
            setOpen={setOpen}
            {...props}
            {...rest}
            className="px-4"
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
