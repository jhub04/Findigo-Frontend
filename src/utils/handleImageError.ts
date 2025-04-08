import noImage from '@/assets/no-image.jpg'

export function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement
    target.src = noImage
}