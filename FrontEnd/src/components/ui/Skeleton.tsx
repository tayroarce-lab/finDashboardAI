import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({ variant = 'rect', width, height, className = '' }: SkeletonProps) {
  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={style}
    />
  );
}
