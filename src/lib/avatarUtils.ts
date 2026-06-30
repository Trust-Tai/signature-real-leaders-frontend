/**
 * Generate initials from a full name
 * @param fullName - The full name of the person
 * @returns The first two letters of the name in uppercase
 */
export function getInitials(fullName: string): string {
  if (!fullName || fullName.trim() === '') {
    return 'U';
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return firstInitial + lastInitial;
}

/**
 * Generate a color based on the name (consistent color for same name)
 * @param name - The name to generate color from
 * @returns A hex color code
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  if (!name) {
    return colors[0];
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Generate an SVG data URL for an avatar with initials
 * @param fullName - The full name of the person
 * @returns A data URL containing the SVG avatar
 */
export function generateInitialsAvatar(fullName: string): string {
  const initials = getInitials(fullName);
  const bgColor = getAvatarColor(fullName);
  
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="80"
        font-weight="600"
        fill="white"
      >${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
