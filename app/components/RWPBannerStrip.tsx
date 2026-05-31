import styles from './RWPBannerStrip.module.css'

interface RWPBannerStripProps {
  height?: number              // desktop height in px, default 140
  mobileHeight?: number        // mobile height in px, default 90
  backgroundPosition?: string  // default 'center'
  overlayOpacity?: number      // 0–1, default 0.12 (subtle lavender wash)
  className?: string
}

export default function RWPBannerStrip({
  height = 140,
  mobileHeight = 90,
  backgroundPosition = 'center',
  overlayOpacity = 0.12,
  className = '',
}: RWPBannerStripProps) {
  return (
    <div
      className={`${styles.strip} ${className}`}
      style={{
        height,
        backgroundPosition,
        ['--mobile-height' as string]: `${mobileHeight}px`,
      }}
      role="presentation"
      aria-hidden="true"
    >
      <div
        className={styles.overlay}
        style={{ opacity: overlayOpacity }}
      />
    </div>
  )
}
