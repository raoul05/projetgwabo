import { ReactNode } from 'react'
import AdminClientLayout from './AdminClientLayout'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}