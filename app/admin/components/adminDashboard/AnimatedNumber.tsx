"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
    value: number;
    duration?: number;
    formatter?: (val: number) => string;
    isInteger?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

export default function AnimatedNumber({
    value,
    duration = 800,
    formatter,
    isInteger = false,
    className,
    style,
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState<number>(value);
    const prevValueRef = useRef<number>(value);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const targetValue = value;

        if (startValue === targetValue) {
            setDisplayValue(targetValue);
            return;
        }

        const startTime = performance.now();

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            const current = startValue + (targetValue - startValue) * eased;
            setDisplayValue(current);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetValue);
                prevValueRef.current = targetValue;
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [value, duration]);

    const valueToFormat = isInteger ? Math.round(displayValue) : displayValue;
    const formatted = formatter
        ? formatter(valueToFormat)
        : Math.round(valueToFormat).toLocaleString("en-IN");

    return (
        <span className={className} style={style}>
            {formatted}
        </span>
    );
}
