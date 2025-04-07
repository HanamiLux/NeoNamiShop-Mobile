export interface ProductDto {
    productId: number;
    productName: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
    imagesUrl: string[];
    averageRating: number;
    totalFeedbacks: number;
    category: CategoryDto;
    orderedProducts: OrderedProductDto[];
    feedbacks: FeedbackDto[];
}

export interface NotificationItem {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface UserDto {
    userId: string;
    login: string;
    email: string;
    roleName: string;
}

export interface CreateUserDto {
    login: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    login?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}

export interface LoginResponse {
    user?: UserDto;
    message?: string;
}

export interface Role {
    roleId: number;
    roleName: string;
    description: string;
}

export interface CreateRole {
    roleName: string;
    description: string;
}

export interface UpdateRole {
    roleName?: string;
    description?: string;
}

export interface OrderedProductDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}

export interface Order {
    orderId: number;
    userId: string;
    date: Date;
    address: string;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    products: {
        description: string;
        orderedProductId: number;
        quantity: number;
        imagesUrlAtOrder: string;
        productName: string;
        priceAtOrder: number;
    }[];
    total: number;
}

export interface FeedbackDto {
    feedbackId: number;
    content: string;
    rate: number;
    userId: string;
}

export interface CategoryDto {
    categoryId: number;
    categoryName: string;
    description: string;
}

export interface Product {
    orderedProductId: string;
    productName: string;
    imagesUrlAtOrder: string;
    quantity: number;
    priceAtOrder: number;
    productId: string;
}

