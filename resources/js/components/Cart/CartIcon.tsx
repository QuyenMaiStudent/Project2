import { SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function CartIcon() {
    const { props } = usePage<SharedData>();
    const cartCount = (props.cartCount ?? 0) as number;
    const isCustomer = (props.isCustomer ?? false) as boolean;

    const prevRef = useRef<number>(cartCount);
    const [highlight, setHighlight] = useState<boolean>(false);

    useEffect(() => {
        if (cartCount > prevRef.current) {
            setHighlight(true);
            const t = setTimeout(() => setHighlight(false), 1000);
            return () => clearTimeout(t);
        }
        prevRef.current = cartCount;
    }, [cartCount]);

    if (!isCustomer) return null;

    return (
        <Link href="/cart" className="relative inline-flex items-center" aria-label="Giỏ hàng">
            <ShoppingCart className={`h-8 w-8 transition-transform duration-200 ${highlight ? 'scale-110 text-white' : ''}`} />
            {cartCount > 0 && (
                <span
                    className={`absolute -top-2 -right-3 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white`}
                >
                    {cartCount}
                </span>
            )}
        </Link>
    );
}

export default CartIcon;
