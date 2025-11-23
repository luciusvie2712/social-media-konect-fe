export const timeAgo = (dateString) => {
    const now = new Date()
    const created = new Date(dateString)
    const second = Math.floor((now - created) / 1000)

    if (second < 60) return `${second} giây trước`
    const minutes = Math.floor(second / 60)
    if (minutes < 60) return `${minutes} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    const years = Math.floor(months / 12);
    return `${years} năm trước`;
}