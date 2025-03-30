
type LoadingSpinnerProps = {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'white';
    className?: string;
};
export function LoadingSpinner({ size = 'medium', color = 'primary', className }: LoadingSpinnerProps) {
    const sizeMap = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    const colorMap = {
        primary: 'border-blue-600',
        white: 'border-white',
    };

    const sizeClass = sizeMap[size];
    const colorClass = colorMap[color];

    return (
        <div
            className={`${sizeClass} ${colorClass} ${className} animate-spin rounded-full border-4 border-t-transparent`}
            role="status"
            aria-label="Loading"
        />
    );
} 