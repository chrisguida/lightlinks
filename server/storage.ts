import type { UserMapping, InsertUserMapping } from '@shared/schema';

export interface IStorage {
  getUserMapping(username: string): Promise<UserMapping | undefined>;
  getUserMappingByNpub(npub: string): Promise<UserMapping | undefined>;
  createUserMapping(mapping: InsertUserMapping): Promise<UserMapping>;
}

export class MemStorage implements IStorage {
  private userMappings: Map<string, UserMapping>;
  private currentId: number;

  constructor() {
    this.userMappings = new Map();
    this.currentId = 1;
  }

  async getUserMapping(username: string): Promise<UserMapping | undefined> {
    return Array.from(this.userMappings.values()).find(
      (mapping) => mapping.username === username
    );
  }

  async getUserMappingByNpub(npub: string): Promise<UserMapping | undefined> {
    return Array.from(this.userMappings.values()).find(
      (mapping) => mapping.npub === npub
    );
  }

  async createUserMapping(mapping: InsertUserMapping): Promise<UserMapping> {
    const id = this.currentId++;
    const userMapping = { ...mapping, id };
    this.userMappings.set(id.toString(), userMapping);
    return userMapping;
  }
}

export const storage = new MemStorage();
