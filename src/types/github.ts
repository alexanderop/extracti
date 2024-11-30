export interface FileFilter {
  include: string[];
  exclude: string[];
  folders: string[];
}

export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface GitHubItem {
  name: string;
  type: 'file' | 'dir';
  url: string;
}