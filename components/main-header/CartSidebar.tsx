"use client";

import { Sidebar } from "primereact/sidebar";

interface CartSidebarProps {
    visible: boolean;
    onHide: () => void;
}

const CartSidebar = ({ visible, onHide }: CartSidebarProps) => {
    return (
        <Sidebar visible={visible} position="right" onHide={onHide}>
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            <p className="text-gray-500">Your cart is empty</p>
        </Sidebar>
    );
};

export default CartSidebar;