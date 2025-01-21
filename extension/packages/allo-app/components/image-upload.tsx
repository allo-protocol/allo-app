import clsx from "clsx";
import { ImageIcon } from "lucide-react";
import { ChangeEvent, type ComponentProps, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Button } from "./ui/button";

type UploadFn = UseMutationResult<{ url: string }, unknown, any, unknown>;

export function ImageUpload({
  name,
  maxSize = 1024 * 1024, // 1 MB
  upload,
  className,
}: {
  name: string;
  maxSize?: number;
  upload: UploadFn;
} & ComponentProps<"img">) {
  const ref = useRef<HTMLInputElement>(null);
  const { control, setError } = useFormContext();

  const setPreview = useMutation({
    mutationFn: async (file: File) => URL.createObjectURL(file),
  });

  return (
    <Controller
      control={control}
      name={name}
      // rules={{ required: "Required" }}
      render={({ field: { value, onChange, ...field } }) => {
        function handleChange(event: ChangeEvent<HTMLInputElement>) {
          const [file] = event.target.files ?? [];
          if (file) {
            if (file?.size >= maxSize) {
              setError(name!, {
                message: `Image file is too large. Max size is ${(maxSize / 1024).toFixed(2)} kb`,
              });
            } else {
              setPreview.mutate(file, {
                onSuccess: () =>
                  upload?.mutate(file, {
                    onSuccess: ({ url }) => onChange(url),
                  }),
              });
            }
          }
        }

        return (
          <div
            className={clsx(
              "group relative h-32 cursor-pointer overflow-hidden",
              className
            )}
            onClick={() => ref.current?.click()}
          >
            <Button
              disabled={upload?.isPending}
              size="icon"
              type="button"
              variant={"ghost"}
              icon={ImageIcon}
              isLoading={upload?.isPending}
              className="absolute bottom-1 right-1 rounded-full"
            />

            <div
              className={clsx(
                "h-full rounded bg-gray-100 bg-cover bg-center bg-no-repeat transition-colors group-hover:bg-gray-50",
                { ["animate-pulse opacity-50"]: upload.isPending }
              )}
              style={{
                backgroundImage: `url("${setPreview.data ?? value}")`,
              }}
            />
            <input
              {...field}
              ref={ref}
              className="hidden"
              accept="image/png, image/jpeg"
              // value={value?.[name]}
              onChange={handleChange}
              type="file"
            />
          </div>
        );
      }}
    />
  );
}
