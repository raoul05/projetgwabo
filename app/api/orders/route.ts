import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Générer un numéro de commande unique
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GW${year}${month}${day}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      customer_name,
      customer_phone,
      district,
      address,
      gps_location,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      notes,
      items
    } = body

    // Vérifier ou créer le client
    let customer_id: string | null = null
    
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, total_orders, total_spent')
      .eq('phone', customer_phone)
      .single()

    if (existingCustomer) {
      customer_id = existingCustomer.id
      // Mettre à jour les stats du client
      await supabase
        .from('customers')
        .update({
          name: customer_name,
          district,
          address,
          gps_location,
          total_orders: existingCustomer.total_orders + 1,
          total_spent: Number(existingCustomer.total_spent) + Number(total)
        })
        .eq('id', customer_id)
    } else {
      // Créer un nouveau client
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customer_name,
          phone: customer_phone,
          district,
          address,
          gps_location,
          total_orders: 1,
          total_spent: total
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
      } else {
        customer_id = newCustomer.id
      }
    }

    // Créer la commande
    const order_number = generateOrderNumber()
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        customer_id,
        customer_name,
        customer_phone,
        district,
        address,
        gps_location,
        subtotal,
        delivery_fee,
        total,
        payment_method,
        notes,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
    }

    // Créer les articles de la commande
    const orderItems = items.map((item: { product_id: string; product_name: string; quantity: number; unit_price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
    }

    // Mettre à jour le stock des produits
    for (const item of items) {
      if (item.product_id) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single()

        if (product) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product_id)
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        items: orderItems
      }
    })

  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || '50'

    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des commandes' }, { status: 500 })
    }

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
