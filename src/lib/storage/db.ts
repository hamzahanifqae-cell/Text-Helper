"use client";
import { openDB, type IDBPDatabase, type DBSchema } from "idb";

// All state in this module lives ONLY in the visitor's browser (IndexedDB).
// Nothing here is ever sent to the server or to the AI provider - it is
// kept separate from the AI request path on purpose, so "local data" and
// "text sent to an AI provider" stay two clearly different things.

interface TextHelperDB extends DBSchema {
  drafts: {
    key: string; // toolSlug
    value: { toolSlug: string; text: string; updatedAt: number };
  };
  history: {
    key: number;
    value: { id?: number; toolSlug: string; input: string; output: string; createdAt: number };
    indexes: { toolSlug: string };
  };
  dictionary: {
    key: string; // lowercase word
    value: { word: string };
  };
  meta: {
    key: string;
    value: { key: string; value: unknown };
  };
}

let dbPromise: Promise<IDBPDatabase<TextHelperDB>> | null = null;

function getDb() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in the browser."));
  }
  if (!dbPromise) {
    dbPromise = openDB<TextHelperDB>("texthelper", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "toolSlug" });
        }
        if (!db.objectStoreNames.contains("history")) {
          const store = db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
          store.createIndex("toolSlug", "toolSlug");
        }
        if (!db.objectStoreNames.contains("dictionary")) {
          db.createObjectStore("dictionary", { keyPath: "word" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

async function safely<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const draftsStore = {
  async save(toolSlug: string, text: string) {
    return safely(async () => {
      const db = await getDb();
      await db.put("drafts", { toolSlug, text, updatedAt: Date.now() });
    }, undefined);
  },
  async load(toolSlug: string) {
    return safely(async () => {
      const db = await getDb();
      return (await db.get("drafts", toolSlug))?.text ?? null;
    }, null);
  },
  async clear(toolSlug: string) {
    return safely(async () => {
      const db = await getDb();
      await db.delete("drafts", toolSlug);
    }, undefined);
  },
};

const MAX_HISTORY_PER_TOOL = 20;

export const historyStore = {
  async add(toolSlug: string, input: string, output: string) {
    return safely(async () => {
      const db = await getDb();
      await db.add("history", { toolSlug, input, output, createdAt: Date.now() });
      const tx = db.transaction("history", "readwrite");
      const index = tx.store.index("toolSlug");
      const entries = await index.getAll(toolSlug);
      if (entries.length > MAX_HISTORY_PER_TOOL) {
        const sorted = entries.sort((a, b) => a.createdAt - b.createdAt);
        const toDelete = sorted.slice(0, entries.length - MAX_HISTORY_PER_TOOL);
        for (const entry of toDelete) {
          if (entry.id !== undefined) await tx.store.delete(entry.id);
        }
      }
      await tx.done;
    }, undefined);
  },
  async list(toolSlug: string) {
    return safely(async () => {
      const db = await getDb();
      const entries = await db.getAllFromIndex("history", "toolSlug", toolSlug);
      return entries.sort((a, b) => b.createdAt - a.createdAt);
    }, []);
  },
  async clear(toolSlug: string) {
    return safely(async () => {
      const db = await getDb();
      const tx = db.transaction("history", "readwrite");
      const index = tx.store.index("toolSlug");
      const entries = await index.getAll(toolSlug);
      for (const entry of entries) {
        if (entry.id !== undefined) await tx.store.delete(entry.id);
      }
      await tx.done;
    }, undefined);
  },
  async clearAll() {
    return safely(async () => {
      const db = await getDb();
      await db.clear("history");
    }, undefined);
  },
};

export const dictionaryStore = {
  async add(word: string) {
    return safely(async () => {
      const db = await getDb();
      await db.put("dictionary", { word: word.trim().toLowerCase() });
    }, undefined);
  },
  async remove(word: string) {
    return safely(async () => {
      const db = await getDb();
      await db.delete("dictionary", word.trim().toLowerCase());
    }, undefined);
  },
  async list(): Promise<string[]> {
    return safely(async () => {
      const db = await getDb();
      const all = await db.getAll("dictionary");
      return all.map((e) => e.word);
    }, []);
  },
  async clear() {
    return safely(async () => {
      const db = await getDb();
      await db.clear("dictionary");
    }, undefined);
  },
};

export async function clearAllLocalData() {
  return safely(async () => {
    const db = await getDb();
    await db.clear("drafts");
    await db.clear("history");
    await db.clear("dictionary");
    await db.clear("meta");
  }, undefined);
}
