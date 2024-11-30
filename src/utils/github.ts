import type { FileFilter, RepoInfo, GitHubItem } from '../types/github';
import { matchesFilter } from './fileFilters';

export async function fetchTextFiles(
  items: GitHubItem[], 
  owner: string, 
  repo: string, 
  filter: FileFilter,
  path = ''
): Promise<string[]> {
  const textContent: string[] = [];

  for (const item of items) {
    if (item.type === 'file') {
      if (matchesFilter(path + item.name, item.name, filter)) {
        try {
          const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}${item.name}`);
          const content = await response.text();
          textContent.push(`File: ${path}${item.name}\n${content}`);
        } catch (err) {
          console.error(`Error fetching ${item.name}:`, err);
        }
      }
    } else if (item.type === 'dir') {
      const response = await fetch(item.url);
      const dirContents = await response.json();
      const dirContent = await fetchTextFiles(dirContents, owner, repo, filter, `${path}${item.name}/`);
      textContent.push(...dirContent);
    }
  }

  return textContent;
}

export function extractRepoInfo(url: string): RepoInfo | null {
  const urlMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!urlMatch) {
    return null;
  }
  return {
    owner: urlMatch[1],
    repo: urlMatch[2]
  };
}