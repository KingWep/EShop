import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/40 backdrop-blur-md",
      "data-[state=open]:animate-[overlayShow_320ms_cubic-bezier(0.16,1,0.3,1)]",
      "data-[state=closed]:animate-[overlayHide_240ms_cubic-bezier(0.4,0,1,1)]",
      className
    )}
    style={{
      WebkitBackdropFilter: "blur(12px)",
    }}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Position & size
        "fixed top-1/2 left-1/2 z-50",
        "w-full max-w-2xl",
        "-translate-x-1/2 -translate-y-1/2",

        // Glassmorphism surface
        "rounded-3xl",
        "bg-white/[0.06] dark:bg-white/[0.04]",
        "backdrop-blur-2xl",
        "border border-white/[0.10]",

        // Layered shadow system
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.3),0_32px_80px_rgba(0,0,0,0.5)]",

        // Text
        "text-white/80",

        // Padding
        "p-8 sm:p-10",

        // Smooth entrance / exit
        "data-[state=open]:animate-[contentShow_380ms_cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=closed]:animate-[contentHide_260ms_cubic-bezier(0.4,0,1,1)]",

        // Overflow for inner scroll patterns
        "overflow-hidden",

        className
      )}
      {...props}
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(168,85,247,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Hairline top shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.20) 50%, transparent 90%)",
        }}
      />

      {/* Content sits above decorative layers */}
      <div className="relative z-10">{children}</div>

      {/* Close button */}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-5 top-5 z-20",
          "flex items-center justify-center",
          "h-8 w-8 rounded-xl",
          "bg-white/[0.06] border border-white/[0.08]",
          "text-white/40 hover:text-white/80",
          "hover:bg-white/[0.12] hover:border-white/[0.16]",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60",
          "active:scale-95"
        )}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>

      <style>{`
        @keyframes overlayShow {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes overlayHide {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes contentShow {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.96);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes contentHide {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -52%) scale(0.96);
            filter: blur(4px);
          }
        }
      `}</style>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 pb-6 border-b border-white/[0.08]",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-6 border-t border-white/[0.08]",
      "sm:flex-row sm:justify-end sm:gap-3",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold tracking-[-0.02em]",
      "text-white/90",
      "leading-snug",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-white/45 leading-relaxed mt-1",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
