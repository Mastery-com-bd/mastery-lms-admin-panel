"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";

type TDeleteProps = {
  onDelete: (
    id: string,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) => Promise<void>;
  id: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const DeleteComponent = ({
  onDelete,
  id,
  loading,
  setLoading,
}: TDeleteProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="cursor-pointer w-full flex items-center justify-start">
          Delete
        </button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Do you really want to delete this
            item?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => {
              onDelete(id, setOpen, setLoading);
            }}
            className="cursor-pointer"
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteComponent;
