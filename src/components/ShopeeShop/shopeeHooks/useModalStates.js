import { useState, useCallback } from "react";

export const useModalStates = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [showConfirmButton, setShowConfirmButton] = useState(false);

    const openDetailsModal = useCallback((orderData) => {
        setSelectedCustomer(orderData);
        setIsDetailsModalOpen(true);
    }, []);

    const closeDetailsModal = useCallback(() => {
        setIsDetailsModalOpen(false);
    }, []);

    const openConfirmModal = useCallback((title, message, action = null, showButton = false) => {
        setModalTitle(title);
        setModalMessage(message);
        setConfirmAction(() => action);
        setShowConfirmButton(showButton);
        setIsConfirmModalOpen(true);
    }, []);

    const closeConfirmModal = useCallback(() => {
        setIsConfirmModalOpen(false);
    }, []);

    return {
        selectedCustomer,
        isDetailsModalOpen,
        isConfirmModalOpen,
        modalTitle,
        modalMessage,
        confirmAction,
        showConfirmButton,
        openDetailsModal,
        closeDetailsModal,
        openConfirmModal,
        closeConfirmModal,
    };
};