// Research projects: named collections of saved papers, backed by the
// projects + project_items tables (owner-scoped RLS).
import { supabase } from './supabase';

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectItemEntry {
  id: string;
  project_id: string;
  favorite_id: string;
  note: string;
  created_at: string;
}

export async function fetchProjects(): Promise<ProjectEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch projects:', error.message);
    return [];
  }
  return (data ?? []) as ProjectEntry[];
}

export async function createProject(name: string, description = ''): Promise<ProjectEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('projects')
    .insert({ name, description })
    .select()
    .maybeSingle();
  if (error) {
    console.error('Failed to create project:', error.message);
    return null;
  }
  return data as ProjectEntry;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete project:', error.message);
    return false;
  }
  return true;
}

export async function fetchProjectItems(projectId: string): Promise<ProjectItemEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('project_items')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Failed to fetch project items:', error.message);
    return [];
  }
  return (data ?? []) as ProjectItemEntry[];
}

export async function addProjectItem(projectId: string, favoriteId: string): Promise<ProjectItemEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('project_items')
    .insert({ project_id: projectId, favorite_id: favoriteId })
    .select()
    .maybeSingle();
  if (error) {
    // Postgres unique-less table: a duplicate add is a user mistake, not an error worth logging loudly.
    console.warn('Failed to add project item:', error.message);
    return null;
  }
  return data as ProjectItemEntry;
}

export async function removeProjectItem(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('project_items').delete().eq('id', id);
  if (error) {
    console.error('Failed to remove project item:', error.message);
    return false;
  }
  return true;
}
