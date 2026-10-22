import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/landing/icons";
import { generalWhatsAppUrl } from "@/lib/quote";
import { cn } from "@/lib/utils";

export function WhatsAppLink({
  children,
  href,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <Button
      nativeButton={false}
      variant={variant}
      size="touch"
      render={
        <a href={href ?? generalWhatsAppUrl()} target="_blank" rel="noopener noreferrer" />
      }
      className={cn("w-full sm:w-auto", className)}
    >
      <WhatsAppIcon className="size-5" />
      {children}
    </Button>
  );
}
