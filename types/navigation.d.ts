import {ProductDto} from "@/types/models";

export type RootStackParamList = {
    "(tabs)": undefined;
    "product": { product: ProductDto };
    "cart": undefined;
    "profile": undefined;
    "auth/modal": undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}