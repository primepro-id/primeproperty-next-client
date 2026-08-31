"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LuPhone, LuX } from "react-icons/lu";
import { MdOutlinePhotoLibrary, MdWhatsapp } from "react-icons/md";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { env } from "@/lib/env";
import { sendGAEvent } from "@next/third-parties/google";
import { PropertyJoinAgent } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { createLeadMutationOptions } from "@/lib/hooks";

type ContactAgentDialogProps = {
  isWhatsapp: boolean;
  propertyWithAgent: PropertyJoinAgent;
  isPhotoRequest?: boolean;
};

export const ContactAgentDialog = ({
  isWhatsapp,
  isPhotoRequest,
  propertyWithAgent,
}: ContactAgentDialogProps) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);
  const leadMutation = useMutation(createLeadMutationOptions());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as any;
    const name = target.name.value;
    const phone = target.phone.value;
    const email = target.email.value;
    if (!name || !phone) {
      setErrorMsg("Harap isi nama dan nomor telepon");
      return;
    }
    const phoneSchema = z
      .string()
      .min(10, "Harap isi nomor telepon")
      .max(15, "Nomor telepon maksimal 15 digit")
      .regex(/^[08]/, "Nomor telepon harus dimulai dengan 0 or 8")
      .regex(/^[^a-zA-Z]*$/, "Nomor telepon tidak valid");

    const phoneValidation = phoneSchema.safeParse(phone);
    if (!phoneValidation.success) {
      const errorMsg = phoneValidation.error.issues[0].message;
      setErrorMsg(errorMsg);
      return;
    }
    if (email) {
      const emailSchema = z.email("Email tidak valid");
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        const errorMsg = emailValidation.error.issues[0].message;
        setErrorMsg(errorMsg);
        return;
      }
    }

    try {
      const payload = {
        user_id: propertyWithAgent[0].user_id,
        property_id: propertyWithAgent[0].id,
        name,
        phone: phone.startsWith("0") ? phone.replace("0", "") : phone,
        ...(email && { email }),
      };

      const lead = await leadMutation.mutateAsync(payload);
      if (lead.data?.id) {
        sendGAEvent("event", "leads_submit");
      }
      return lead;
    } catch (error) {
      console.error(error);
    } finally {
      const whatsappUrl = new URL("https://api.whatsapp.com/send");
      const propertyUrl =
        env.NEXT_PUBLIC_HOST_URL + `/properties/${propertyWithAgent[0].id}`;
      whatsappUrl.searchParams.append(
        "phone",
        `62${propertyWithAgent[1].phone_number}`,
      );
      if (isWhatsapp && isPhotoRequest) {
        const text = `Hai, saya ${name} ingin meminta gambar lebih terakit: ${propertyWithAgent[0].title}\nyang berlokasi di ${propertyWithAgent[0].street} - ${propertyWithAgent[0].regency}.\nMohon informasi nya terkait unit tersebut: ${propertyUrl}`;
        whatsappUrl.searchParams.append("text", text);
      } else if (isWhatsapp) {
        const text = `Hai, saya ${name} tertarik dengan informasi mengenai: ${propertyWithAgent[0].title}\nyang berlokasi di ${propertyWithAgent[0].street} - ${propertyWithAgent[0].regency}.\nMohon informasi nya terkait unit tersebut: ${propertyUrl}`;
        whatsappUrl.searchParams.append("text", text);
        window.open(whatsappUrl, "_blank");
      } else {
        const url = `tel: +62${propertyWithAgent[1].phone_number}`;
        window.open(url, "_blank");
      }
      sendGAEvent("event", "leads_redirect");
      setErrorMsg("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger
        onClick={() => {
          setOpen(true);
          sendGAEvent("event", "leads_popup");
        }}
        className={cn(
          buttonVariants({}),
          "rounded-lg cursor-pointer line-clamp-1 flex",
          isWhatsapp && !isPhotoRequest
            ? "bg-emerald-500 hover:bg-emerald-400 text-base text-background"
            : "",
        )}
      >
        {isWhatsapp && isPhotoRequest ? (
          <>
            <MdOutlinePhotoLibrary />
            Minta foto lainnya
          </>
        ) : isWhatsapp ? (
          <>
            <MdWhatsapp />
            WHATSAPP
          </>
        ) : (
          <>
            <LuPhone />
            <span>
              +62{propertyWithAgent[1].phone_number.slice(0, 4).concat("...")}
            </span>
          </>
        )}
      </DialogTrigger>
      <DialogContent
        className="md:max-w-sm z-[100]"
        overlayClassName="z-[100]"
        onOverlayClick={() => setOpen(false)}
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="font-bold">Hubungi Agen</DialogTitle>
          <DialogClose onClick={() => setOpen(false)}>
            <LuX className="text-xl" />
          </DialogClose>
        </div>
        <DialogDescription className="text-muted-foreground text-sm mb-4">
          Harap isi data berikut untuk berkomunikasi dengan agen
        </DialogDescription>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Nama"
            type="text"
            className="focus-visible:ring-transparent"
            name="name"
          />
          <div className="flex items-center">
            <span className="flex items-center justify-center bg-input h-10 px-2 rounded-l border-input text-sm ">
              +62
            </span>
            <Input
              placeholder="Nomor Telepon"
              type="tel"
              className="rounded-l-none focus-visible:ring-transparent ring-offset-transparent"
              name="phone"
            />
          </div>
          <Input
            placeholder="Email (optional)"
            type="email"
            className="focus-visible:ring-transparent"
            name="email"
          />

          <Button
            type="submit"
            size="sm"
            className={cn(
              "rounded-lg cursor-pointer line-clamp-1 flex ",
              isWhatsapp && !isPhotoRequest
                ? "bg-emerald-500 hover:bg-emerald-400 text-base text-background"
                : "",
            )}
          >
            {isWhatsapp && isPhotoRequest ? (
              <>
                <MdOutlinePhotoLibrary />
                Minta foto lainnya
              </>
            ) : isWhatsapp ? (
              <>
                <MdWhatsapp />
                WhatsApp
              </>
            ) : (
              <>
                <LuPhone />
                <span>Telepon</span>
              </>
            )}
          </Button>
        </form>
        {errorMsg && (
          <span className="text-destructive mt-4 text-sm">{errorMsg}</span>
        )}
      </DialogContent>
    </Dialog>
  );
};
