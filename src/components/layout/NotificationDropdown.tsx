"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
    markAsRead,
    markAllAsRead,
    clearNotifications,
} from "@/store/slices/notificationSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
    const dispatch = useAppDispatch();
    const { notifications } = useAppSelector((state) => state.notifications);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-muted-foreground hover:text-foreground transition-all"
                >
                    <Bell className="h-[22px] w-[22px]" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-background shadow-sm"
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 mt-2 p-0 overflow-hidden rounded-2xl border-border bg-card/95 backdrop-blur-xl shadow-2xl">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <DropdownMenuLabel className="p-0 font-black text-sm tracking-tight">Notifications</DropdownMenuLabel>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] font-bold hover:bg-primary/10 hover:text-primary rounded-lg"
                                onClick={() => dispatch(markAllAsRead())}
                            >
                                Mark all read
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => dispatch(clearNotifications())}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="max-h-[350px] overflow-y-auto overflow-x-hidden pt-1 pb-1">
                    {notifications.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
                                <Bell className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-bold opacity-50">No new notifications</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {notifications.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    className={`px-4 py-3 cursor-default focus:bg-muted/50 transition-colors border-l-4 ${n.read ? "border-transparent opacity-60" : "border-primary bg-primary/5"
                                        }`}
                                    onClick={() => dispatch(markAsRead(n.id))}
                                >
                                    <div className="flex gap-3 w-full">
                                        <div className="mt-1 h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-xs font-black tracking-tight leading-none">{n.title}</p>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                                                    {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium line-clamp-2">
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-2 border-t bg-muted/10">
                        <Button variant="ghost" className="w-full h-8 text-[11px] font-black tracking-widest uppercase hover:bg-primary/5">
                            View All History
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
