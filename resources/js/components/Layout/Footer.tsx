import { Link } from '@inertiajs/react';

function Footer() {
    return (
        <footer className="mt-0 w-full bg-[#0AC1EF] px-6 py-8 text-white">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="TechNest Logo" className="h-10 w-auto" />
                    <span className="text-lg font-bold">TechNest</span>
                </div>
                <div className="text-center text-base md:text-left">
                    © {new Date().getFullYear()} TechNest. All rights reserved.
                    <div className="mt-2 flex flex-col gap-2 text-white/90 md:flex-row md:items-center">
                        <span>
                            Hotline:{' '}
                            <a href="tel:0979701300" className="underline hover:text-white">
                                0979 701 300
                            </a>
                        </span>
                        <span>
                            Email:{' '}
                            <a href="mailto:maixuangiaquyen10@gmail.com" className="underline hover:text-white">
                                maixuangiaquyen10@gmail.com
                            </a>
                        </span>
                        <span>
                            Facebook:{' '}
                            <a
                                href="https://www.facebook.com/maixuangiaquyen"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-white"
                            >
                                facebook.com/maixuangiaquyen
                            </a>
                        </span>
                    </div>
                </div>
                <div className="flex gap-6">
                    <Link href="/about" className="text-white hover:underline">
                        Giới thiệu
                    </Link>
                    <Link href="/support" className="text-white hover:underline">
                        Hỗ trợ
                    </Link>
                    <Link href="/contact" className="text-white hover:underline">
                        Liên hệ
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
