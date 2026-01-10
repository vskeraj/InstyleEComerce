"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@/types";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/* këtu vazhdon KREJT kodi yt i cart-it */
export default function CartClient() {
  // ...
}
=

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
  },
  {
    id: 2,
    title: "Shipping Address",
  },
  {
    id: 3,
    title: "Payment",
  },
];

export default function CartClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // Rest of your existing cart logic here
  // ...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your existing cart JSX */}
      {/* ... */}
    </div>
  );
}