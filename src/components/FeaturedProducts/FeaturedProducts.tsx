'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/lib/supabase'
import { ArrowRight } from "lucide-react";
import styles from '@/components/FeaturedProducts/FeaturedProducts.module.css'
import ProductCard from '../ProductCard/Productcard';
import Loader from '../Spinner/Spinner';

export interface Products {
    id: string,
    name: string,
    description: string,
    price: number,
    image_url: string,
    slug: string
}

export default function FeaturedProducts() {

    const supabase = client()
    const [featuredProducts, setFeaturedProducts] = useState<Products[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchFeaturedProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_featured', true)
                    .limit(6)
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                } else {
                    setFeaturedProducts(data)
                }
            } catch (err: any) {
                console.error('Error fetching featured products: ', err.message);
                setError('Failed to load featured products!');
            } finally {
                setLoading(false)
            }
        }

        fetchFeaturedProducts()

    }, [supabase])

    if (loading) {
        return <Loader message={'Loading Featured products'} />
    }

    if (error) {
        return <p className={styles.message} role="alert">{error}</p>;
    }

    if (featuredProducts.length === 0) {
        return null
    }

    return (
        <section
            className={styles.featuredSection}
            id='featuredProducts'
            aria-labelledby="featured-heading"
        >
            {/* --- HEADER --- */}
            <h2 id="featured-heading" className={styles.heading}>Featured Products</h2>

            {/* --- PRODUCT GRID --- */}
            <div className={styles.grid} role="list">
                {featuredProducts.map((product) => (
                    <div key={product.id} role="listitem">
                        <ProductCard product={product} />
                    </div>
                ))}

                {/* --- CALL TO ACTION --- */}
                <div className={styles.viewAllContainer}>
                    <Link
                        href="/products"
                        className={styles.viewAllButton}
                        aria-label="View all handcrafted products"
                    >
                        View All <ArrowRight size={18} className={styles.icon} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    )

}