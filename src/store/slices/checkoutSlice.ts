import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CheckoutStep = "shipping" | "payment" | "review" | "success";

interface ShippingData {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
}

interface PaymentData {
    cardNumber: string;
    expiry: string;
    cvc: string;
    nameOnCard: string;
}

interface CheckoutState {
    step: CheckoutStep;
    shippingData: ShippingData;
    paymentData: PaymentData;
}

const initialState: CheckoutState = {
    step: "shipping",
    shippingData: {
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: "",
    },
    paymentData: {
        cardNumber: "",
        expiry: "",
        cvc: "",
        nameOnCard: "",
    },
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<CheckoutStep>) => {
            state.step = action.payload;
        },
        updateShipping: (state, action: PayloadAction<Partial<ShippingData>>) => {
            state.shippingData = { ...state.shippingData, ...action.payload };
        },
        updatePayment: (state, action: PayloadAction<Partial<PaymentData>>) => {
            state.paymentData = { ...state.paymentData, ...action.payload };
        },
        resetCheckout: (state) => {
            return initialState;
        },
    },
});

export const { setStep, updateShipping, updatePayment, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
