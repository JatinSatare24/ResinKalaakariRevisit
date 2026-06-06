'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import styles from '@/components/Carousel/Carousel.module.css'

export interface CarouselProps {
    children: ReactNode | ReactNode[],
    autoplay?: boolean,
    interval?: number,
    showArrows?: boolean,
    className?: string
}

export default function Carousel({
    children,
    autoplay = false,
    interval = 4000,
    showArrows = true,
    className = "",
}: CarouselProps) {

    const slides = React.Children.toArray(children)
    const [index, setIndex] = useState<number>(0)

    const next = () => {
        setIndex((prev) => (prev + 1) % slides.length)
    }

    const prev = () => {
        setIndex((prev) => prev === 0 ? slides.length - 1 : prev - 1)
    }

    useEffect(() => {
        if (!autoplay || slides.length <= 1) return

        const timer = setInterval(next, interval)
        return () => clearInterval(timer)
    }, [autoplay, interval, showArrows])

    return (
        <section
            className={`${styles.carousel} ${className}`}
            role="region"
            aria-roledescription="carousel"
            aria-label="Image Carousel"
        >
            {/* Sliding Track */}
            <div
                className={styles.track}
                style={{ transform: `translateX(-${index * 100}%)` }}
                aria-live={autoplay ? "off" : "polite"}
            >
                {slides.map((slide, i) => (
                    <div
                        className={styles.slide}
                        key={i}
                        aria-hidden={i !== index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} of ${slides.length}`}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            {showArrows && slides.length > 1 && (
                <div className={styles.controls}>
                    <button
                        className={styles.prev}
                        onClick={prev}
                        aria-label="Previous Slide"
                        type="button"
                    >
                        &lt;
                    </button>
                    <button
                        className={styles.next}
                        onClick={next}
                        aria-label="Next Slide"
                        type="button"
                    >
                        &gt;
                    </button>
                </div>
            )}

        </section>
    )

}