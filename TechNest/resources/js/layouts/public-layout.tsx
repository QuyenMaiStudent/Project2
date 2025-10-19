import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import ShowChatBot from '@/components/Layout/ShowChatBot';
import React from 'react'

interface publicLayoutProps {
    children: React.ReactNode;
}

function publicLayout({ children }: publicLayoutProps) {
  return (
    <>
        <Header />
        <main>{children}</main>
        <Footer />
        <ShowChatBot />
    </>
  )
}

export default publicLayout
