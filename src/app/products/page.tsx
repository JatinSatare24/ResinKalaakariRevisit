import { createServerSupabaseClient } from "@/lib/server";

export default async function productsPage({ searchParams }: {
    searchParams: Promise<{ category?: string; search?: string; sort?: string }>
}) {

    const supabase = await createServerSupabaseClient()

    const params = await searchParams
    const filteredCategory = params?.category
    const searchQuery = params?.search?.trim()
    const sortQuery = params?.sort

    let productsQuery = supabase
        .from('products')
        .select(`
        *,
        categories!inner(
        id,
        name, 
        slug)
        `)

    if (filteredCategory) {
        productsQuery = productsQuery.eq('categories.slug', filteredCategory)
    }

    if (searchQuery) {
        productsQuery = productsQuery.ilike('name', `%${searchQuery}%`)
    }

    if (sortQuery === 'price_asc') {
        productsQuery = productsQuery.order('price', { ascending: true })
    } else if (sortQuery === 'price_desc') {
        productsQuery = productsQuery.order('price', { ascending: false })
    } else if (sortQuery === 'newest') {
        productsQuery = productsQuery.order('created_at', { ascending: false })
    }

    const [productRes, categoriesRes] = await Promise.all([
        productsQuery,
        supabase.from('categories').select('id, name, slug, displayOrder').order('displayOrder')
    ])

    const { data: filteredProducts, error: productsError } = productRes
    const { data: categories, error: categoriesError } = categoriesRes

    if (productsError || categoriesError) {
        console.error('Error:', productsError?.message || categoriesError?.message)
        return <p>Cannot load data!</p>
    }

    const selectedCategory = categories?.find(c => c.slug === filteredCategory)
    const products = filteredProducts ?? []

    return (
        <>
        </>
    )
}