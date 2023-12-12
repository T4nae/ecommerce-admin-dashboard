import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { productIds, storeUrl } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }
    const product = async (productId: string) => {
        const product = await prismadb.product.findUnique({
            where: { id: productId },
        });
        return product;
    };

    const fetchProducts = async (productIds: string[]) => {
        const fetchedProducts = await Promise.all(
            productIds.map(async (productId: string) => {
                return (await product(productId))!;
            })
        );
        return fetchedProducts;
    };

    const products: Product[] = await fetchProducts(productIds);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    let error = false;
    products.forEach(async (product) => {
        if (product.quantity.toNumber() !== 0) {
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price.toNumber() * 100,
                },
            });
        } else {
            error = true;
        }
    });

    if (error) {
        return new NextResponse("Product in you order is out of stock", {
            status: 400,
        });
    }

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                })),
            },
        },
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${storeUrl}/cart?success=1`,
        cancel_url: `${storeUrl}/cart?canceled=1`,
        metadata: {
            orderId: order.id,
        },
    });

    return NextResponse.json(
        { url: session.url },
        {
            headers: corsHeaders,
        }
    );
}
