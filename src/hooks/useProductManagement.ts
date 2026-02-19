"use client";

import { useState, useCallback } from "react";
import { deleteProduct } from "@/lib/api";
import { Product } from "@/lib/types";
import { toast } from "sonner";

interface UseProductManagementProps {
    onProductDeleted?: (id: number) => void;
}

export function useProductManagement({ onProductDeleted }: UseProductManagementProps = {}) {
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteProduct(deleteTarget.id);
            if (onProductDeleted) {
                onProductDeleted(deleteTarget.id);
            }
            toast.success(`"${deleteTarget.title}" deleted successfully`);
            setDeleteTarget(null);
        } catch {
            // Error is handled by global interceptor
        } finally {
            setDeleting(false);
        }
    }, [deleteTarget, onProductDeleted]);

    return {
        deleteTarget,
        deleting,
        setDeleteTarget,
        handleDeleteConfirm,
    };
}
