# GWABO — Backend Architecture & System Instructions

## Objective

Build a scalable, secure, production-ready backend architecture for GWABO.

GWABO is a modern African ecommerce platform for ordering fresh food products online in Bouaké, Côte d’Ivoire.

The backend must support:

* ecommerce operations
* inventory management
* employee management
* analytics
* financial tracking
* order processing
* WhatsApp workflows
* scalable future growth

The backend architecture must be:

* clean
* modular
* secure
* scalable
* maintainable

---

# TECHNOLOGY STACK

Use:

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security (RLS)
* TypeScript
* Next.js API architecture

---

# DATABASE ARCHITECTURE

Use a proper relational database structure.

All relationships must be normalized and scalable.

Avoid duplicated data.

Use:

* foreign keys
* indexes
* optimized queries
* proper constraints

---

# CORE DATABASE TABLES

## profiles

Store all users.

Fields:

* id
* nom
* telephone
* email
* photo_url
* role
* actif
* created_at

---

# employee_roles

Supported roles:

* admin
* accountant
* order_manager
* delivery_agent
* customer_support

Use role-based access control.

---

# categories

Fields:

* id
* nom
* icon
* slug
* actif
* created_at

---

# products

Fields:

* id
* nom
* slug
* description
* prix
* unite
* stock
* categorie_id
* disponible
* image_urls
* video_url
* created_at

Supported units:

* kg
* g
* L
* cl
* ml
* piece
* sachet
* plateau
* botte

Quantities must support decimal values.

---

# orders

Fields:

* id
* numero_commande
* client_id
* total
* livraison
* statut
* moyen_paiement
* quartier
* adresse_precise
* latitude
* longitude
* notes
* created_at

---

# order_items

Fields:

* id
* commande_id
* produit_id
* quantite
* prix_unitaire
* sous_total

---

# inventory_movements

Track stock movements.

Fields:

* id
* produit_id
* type
* quantite
* raison
* created_at

Types:

* stock_in
* stock_out
* adjustment

---

# employees

Fields:

* id
* nom
* telephone
* role
* pin
* actif
* created_at

---

# financial_transactions

Track business finances.

Fields:

* id
* type
* montant
* description
* commande_id
* created_at

Types:

* revenue
* expense
* refund

---

# notifications

Fields:

* id
* user_id
* titre
* message
* lu
* created_at

---

# SUPABASE AUTHENTICATION

Implement professional authentication architecture.

---

# CUSTOMER AUTH

Simple onboarding flow:

* name
* phone number

Automatically create customer profile.

Avoid complex registration.

---

# EMPLOYEE AUTH

Use:

* phone number
* 6-digit PIN

---

# ADMIN AUTH

Use:

* phone number
* password
* admin PIN

Implement secure admin sessions.

---

# ROLE-BASED ACCESS CONTROL

Protect all dashboard routes.

Each role must have specific permissions.

Examples:

## accountant

Can:

* view finances
* view analytics

Cannot:

* modify admin settings

---

## order_manager

Can:

* manage orders
* update delivery status

Cannot:

* access finance data

---

## delivery_agent

Can:

* view assigned deliveries
* update delivery status

Cannot:

* access dashboard analytics

---

# ROW LEVEL SECURITY (RLS)

Implement proper Supabase RLS policies.

Requirements:

* customers only access their own orders
* employees only access authorized data
* admins have full access
* prevent unauthorized writes

All sensitive tables must use RLS.

---

# STORAGE ARCHITECTURE

Use Supabase Storage professionally.

Buckets:

## produits-images

Store:

* product images

## produits-videos

Store:

* short product videos

Rules:

* optimize images
* compress videos
* max 3 images
* max 1 video
* public read access
* secure uploads

---

# ORDER SYSTEM

Implement scalable order architecture.

Order statuses:

* pending
* confirmed
* delivering
* delivered
* cancelled

Each status update must be traceable.

---

# WHATSAPP ORDER FLOW

After checkout:
Automatically generate WhatsApp Business formatted message.

Include:

* customer info
* products
* quantities
* totals
* payment method
* delivery location
* GPS link

---

# INVENTORY SYSTEM

Implement professional stock management.

Features:

* stock tracking
* stock alerts
* inventory history
* low stock warnings
* automatic stock updates after orders

Prevent overselling.

---

# ANALYTICS SYSTEM

Backend must support analytics for dashboard.

Required statistics:

* total revenue
* total orders
* best selling products
* customer growth
* delivery performance
* revenue trends
* order trends

Optimize queries for dashboard performance.

---

# API ARCHITECTURE

Use clean reusable services.

Structure:

lib/
services/
hooks/
types/

Avoid duplicated logic.

Use:

* reusable queries
* centralized services
* scalable patterns

---

# PERFORMANCE OPTIMIZATION

Optimize backend for:

* mobile users
* slow internet
* fast response time
* low bandwidth

Requirements:

* optimized queries
* pagination
* lazy loading
* efficient joins
* caching strategies

---

# SECURITY REQUIREMENTS

Implement:

* protected routes
* secure authentication
* role validation
* input validation
* upload validation
* rate limiting
* secure sessions

Never expose sensitive admin data publicly.

---

# SCALABILITY

The backend must be scalable for future expansion across Côte d’Ivoire.

Architecture must support:

* multiple delivery zones
* more employees
* more vendors
* higher order volume
* future mobile applications

---

# DEVELOPMENT RULES

* Write production-ready backend architecture
* Keep code modular and maintainable
* Use scalable database design
* Use TypeScript properly
* Use reusable services
* Optimize Supabase usage
* Avoid unnecessary complexity

---

# FINAL GOAL

Build a robust ecommerce backend capable of powering a major African online grocery platform with:

* professional operations
* scalable architecture
* strong security
* fast performance
* clean maintainable code
