export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string; // for QR routing: /shop/slug
  logoUrl?: string;
  config: {
    primaryColor: string;
  };
  createdAt: string;
}

export interface Glasses {
  id: string;
  shopId: string;
  name: string;
  brand: string;
  imageUrl: string; // Preview image
  modelUrl?: string; // Path to 3D model or overlay asset
  price: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Landmark types for MediaPipe (useful for frontend/backend consistency)
export interface Point2D {
  x: number;
  y: number;
}

export interface FaceLandmarks {
  leftEye: Point2D;
  rightEye: Point2D;
  noseBridge: Point2D;
}
