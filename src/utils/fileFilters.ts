export function createDefaultFilter() {
  return {
    include: ['js', 'jsx', 'ts', 'tsx', 'vue', 'css', 'scss', 'html', 'md', 'json'],
    exclude: ['node_modules', '.git', 'dist', 'build'],
    folders: [],
  }
}

export function matchesFilter(path: string, filename: string, filter: { include: string[], exclude: string[], folders: string[] }): boolean {
  // Check if path contains any excluded patterns
  if (filter.exclude.some(pattern => path.includes(pattern))) {
    return false
  }

  // If folders are specified, check if the path starts with any of them
  if (filter.folders.length > 0) {
    const isInSelectedFolder = filter.folders.some(folder =>
      path.startsWith(`${folder}/`) || path === folder,
    )
    if (!isInSelectedFolder) {
      return false
    }
  }

  // If no include patterns are specified, accept all files
  if (filter.include.length === 0) {
    return true
  }

  // Check if file matches any include patterns
  return filter.include.some(ext => filename.toLowerCase().endsWith(`.${ext}`))
}
