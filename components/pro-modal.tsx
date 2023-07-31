"use client";

import axios from "axios";
import { Check, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, add } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { tools } from "@/constants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const savedExpiryTime = localStorage.getItem("discountExpiry");
    let expiryTime: Date;

    if (savedExpiryTime) {
      expiryTime = new Date(savedExpiryTime);
    } else {
      expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 12);
      localStorage.setItem("discountExpiry", expiryTime.toISOString());
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now >= expiryTime) {
        expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 12);
        localStorage.setItem("discountExpiry", expiryTime.toISOString());
      }

      const diffInSeconds = (expiryTime.getTime() - now.getTime()) / 1000;
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      setTimeLeft(`${hours} hours ${minutes} minutes`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl">
              Upgrade to Genius
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="p-3 border-black/5 flex items-center justify-between transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
            <p className="text-sm">
              Get unlimited access to all these powerful tools and more.
            </p>
          </DialogDescription>
          <div className="text-center mt-6 mb-2">
          <div className="text-black-600 mt-6 font-bold text-xl underline">
              Launch Discount - Save $15
            </div>
            {timeLeft && (
              <div className="text-zinc-900 font-medium text-xs">
                Discount ends in {timeLeft}
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={onSubscribe}
            size="lg"
            variant="premium"
            className="w-full hover:opacity-80 transition"
          >
            Upgrade Now
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
