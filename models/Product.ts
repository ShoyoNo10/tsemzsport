import mongoose, { Model, Schema, Types } from "mongoose";

interface ProductSizeDocument {
  size: string;
  stock: number;
}

interface ProductDocument {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: Types.ObjectId;
  sizeVariants: ProductSizeDocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSizeSchema = new Schema<ProductSizeDocument>(
  {
    size: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const ProductSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sizeVariants: {
      type: [ProductSizeSchema],
      required: true,
      default: [],
      validate: {
        validator(value: ProductSizeDocument[]): boolean {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Дор хаяж 1 size шаардлагатай",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<ProductDocument> =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;