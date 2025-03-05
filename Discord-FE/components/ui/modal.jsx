import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {cn} from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


export function PopupModal({ children, formComponent: FormComponent, props, open, setOpen, className, ...rest }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className={cn("sm:max-w-[425px]", className)}>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>
              {props.description}
            </DialogDescription>
          </DialogHeader>
          {FormComponent && <FormComponent setOpen= {setOpen} {...rest}/>}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>
            {props.description}
          </DrawerDescription>
        </DrawerHeader>
        {FormComponent && <FormComponent className= "px-4" />}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}